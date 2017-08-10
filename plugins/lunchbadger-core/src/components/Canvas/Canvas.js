import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import QuadrantContainer from '../Quadrant/QuadrantContainer';
import CanvasOverlay from './CanvasOverlay';
import {addConnection, moveConnection, removeConnection} from '../../reduxActions/connections';
import Connection from '../../stores/Connection';
import {clearCurrentElement} from '../../reduxActions';
import Connections from './Connections';
import './Canvas.scss';

class Canvas extends Component {
  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      lastUpdate: new Date(),
      canvasHeight: null,
      connections: [],
      scrollLeft: 0,
    };
    // this.connectionsChanged = () => {
    //   this.setState({connections: Connection.getData()});
    // }
    this.dropped = false;
  }

  componentWillMount() {
    // this.repaint = setInterval(() => {
    //   // this.paper.repaintEverything();
    // }, 50);

    // Connection.addChangeListener(this.connectionsChanged);
  }

  componentDidMount() {
    this.canvasWrapperDOM.addEventListener('scroll', this.onCanvasScroll);
    this.paper = this.context.paper.initialize();
    // jsPlumb has to be instantiated here, not in componentWillMount, because
    // the canvas element has to already be rendered in order for it to work.
    // this.paper = jsPlumb.getInstance({
    //   DragOptions: {cursor: 'pointer', zIndex: 2000},
    //   ReattachConnections: true,
    //   PaintStyle: {
    //     strokeStyle: '#ffffff',
    //     lineWidth: 6
    //   },
    //   Connector: ['Flowchart', {cornerRadius: 15}],
    //   Container: 'canvas',
    //   ConnectionOverlays: [
    //     ['Label',
    //       {
    //         label: 'X',
    //         id: 'remove-button',
    //         cssClass: 'remove-button'
    //       }
    //     ]
    //   ],
    //   Anchors: [0.5, 0, 0.5, 0.5]
    // });

    // Children get paper object as props, so we have to force React to re-
    // deliver props to them after creating this.paper.
    // this.forceUpdate();

    // LunchBadgerCore.utils.paper = this.paper;
    //
    this._attachPaperEvents();
    // this._registerConnectionTypes();
    //
    //
    jsPlumb.fire('canvasLoaded', this.paper);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loadingProject && !nextProps.loadingProject && !this.connectionsHandled) {
      this.connectionsHandled = true;
      setTimeout(this.handleInitialConnections);
    }
  }

  componentWillUnmount() {
    this.canvasWrapperDOM.removeEventListener('scroll', this.onCanvasScroll);
    this.paper.stopRepaintingEverything();
    // Connection.removeChangeListener(this.connectionsChanged);
  }

  handleInitialConnections = () => {
    const {store: {getState}} = this.context;
    getState().initialConnections.forEach((connection) => {
      const portOut = document.getElementById(`port_out_${connection.fromId}`);
      const portIn = document.getElementById(`port_in_${connection.toId}`);
      if (portOut && portIn) {
        this.paper.connect({
          source: portOut.querySelector('.port__anchor'),
          target: portIn.querySelector('.port__anchor'),
          parameters: {
            existing: 1,
          },
        });
      }
    });
  }

  onCanvasScroll = (event) => {
    this.setState({scrollLeft: event.target.scrollLeft});
  }

  _disconnect(connection) {
    this.paper.detach(connection, {
      fireEvent: false
    });
  }

  _flipConnection(info) {
    this.paper.connect({
      source: info.target,
      target: info.source
    });
  }

  _isConnectionValid(source, sourceId, target, targetId) {
    if (sourceId === targetId) return false;
    if ((source.parentElement.classList.contains('port-in') && target.parentElement.classList.contains('port-in')) ||
      (source.parentElement.classList.contains('port-out') && target.parentElement.classList.contains('port-out'))) {
      return false;
    }
    // Only one connection between two entities is allowed.
    if (Connection.findEntityIndexBySourceAndTarget(sourceId, targetId) >= 0 ||
        Connection.findEntityIndexBySourceAndTarget(targetId, sourceId) >= 0) {
      return false;
    }
    return true;
  }

  // _registerConnectionTypes() {
  //   this.paper.registerConnectionTypes({
  //     'wip': {
  //       cssClass: 'loading',
  //       detachable: false
  //     }
  //   });
  // }

  _executeStrategies(strategies, info) {
    const {store: {dispatch}} = this.context;
    for (let strategy of strategies) {
      let fulfilled = dispatch(strategy.checkAndFulfill(info));
      if (fulfilled != null) {
        return fulfilled;
      }
    }
    return null;
  }

  _attachPaperEvents() {
    const {store: {dispatch, getState}} = this.context;

    this.paper.bind('connection', (info) => {
      const {source, connection} = info;
      if (source.parentElement.classList.contains('port-in')) {
        this._flipConnection(info);
        this._disconnect(connection);
        return;
      }
      let dropped = info.connection.getParameter('forceDropped') || this.dropped;
      this.dropped = false;
      // This is set when a connection is being moved (connect event is also
      // triggered). We want to handle this in 'connectionMoved' handler. Note
      // that this is *not* set when a connection is picked up and then dropped
      // in the same place.
      if (connection.suspendedElement) return;
      let fulfilled = null;
      if (dropped) {
        // let strategies = this.props.plugins.getConnectionCreatedStrategies();
        fulfilled = this._executeStrategies(getState().plugins.onConnectionCreatedStrategy, info);
      }
      if (fulfilled === null) {
        dispatch(addConnection(info));
      } else if (fulfilled === false) {
        this._disconnect(connection);
      }
    });

    this.paper.bind('connectionMoved', (info) => {
      let {originalSourceEndpoint, originalTargetEndpoint, connection} = info;
      let fulfilled = this._executeStrategies(getState().plugins.onConnectionMovedStrategy, info);
      if (fulfilled === null) {
        dispatch(moveConnection(info));
      } else if (fulfilled === false) {
        // Have to save these values and call on next event loop iteration
        // because jsPlumb needs the connection to be intact to finish
        // processing this event after this handler is done.
        let {suspendedElementType, suspendedElement} = connection;
        setTimeout(() => {
          this._disconnect(connection);
          if (suspendedElementType === 'target') {
            this.paper.connect({
              source: originalSourceEndpoint.element,
              target: suspendedElement
            }, {
              fireEvent: false
            });
          } else {
            this.paper.connect({
              source: suspendedElement,
              target: originalTargetEndpoint.element,
            }, {
              fireEvent: false,
            });
          }
        });
      }
    });

    this.paper.bind('connectionDetached', (info) => {
      let fulfilled = this._executeStrategies(getState().plugins.onConnectionDeletedStrategy, info);
      if (fulfilled === null) {
        dispatch(removeConnection(info.sourceId, info.targetId));
      } else if (fulfilled === false) {
        this.paper.connect({
          source: info.source,
          target: info.target,
          fireEvent: false,
        });
      }
    });

    this.paper.bind('beforeDrop', (info) => {
      const {sourceId, targetId} = info;
      const sourceElement = document.querySelector(`#${sourceId}`);
      const targetElement = document.querySelector(`#${targetId}`);
      if (!this._isConnectionValid(sourceElement, sourceId, targetElement, targetId)) {
        return false;
      }
      // Save the fact that the connection was dropped. This is used in the
      // 'connect' event handler. This is the only way for it to know that
      // the connection was created by the user, vs programmatically, e.g. when
      // loading from the server.
      this.dropped = true;
      return true;
    });

    this.paper.bind('beforeDrag', () => true);

    this.paper.bind('connectionAborted', () => true);

    this.paper.bind('click', (connection, event) => {
      if (event.target.classList.contains('remove-button')) {
        this.paper.detach(connection);
      }
    });
  }

  handleClick = () => this.context.store.dispatch(clearCurrentElement());

  render() {
    const {isPanelClosed} = this.props;
    const {scrollLeft} = this.state;
    const canvasHeight = isPanelClosed ? null : this.state.canvasHeight;
    return (
      <section
        className="canvas"
        onClick={this.handleClick}
      >
        <CanvasOverlay />
        <div
          style={{height: canvasHeight}}
          className="canvas__wrapper"
          ref={(r) => {this.canvasWrapperDOM = r;}}
        >
          <div style={{height: canvasHeight}} className="canvas__legend">
            <div className="canvas__label canvas__label--left">Producers</div>
            <div className="canvas__label canvas__label--right">Consumers</div>
          </div>
          <QuadrantContainer
            canvasHeight={canvasHeight}
            className="canvas__container"
            id="canvas"
            scrollLeft={scrollLeft}
          />
        </div>
        <Connections />
      </section>
    );
  }
}

const selector = createSelector(
  state => !state.states.currentlyOpenedPanel,
  state => state.loadingProject,
  (isPanelClosed, loadingProject) => ({isPanelClosed, loadingProject}),
);

export default connect(selector)(Canvas);
