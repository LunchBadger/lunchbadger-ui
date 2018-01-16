import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import QuadrantContainer from '../Quadrant/QuadrantContainer';
import CanvasOverlay from './CanvasOverlay';
import Connections from '../../stores/Connections';
import {clearCurrentElement} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
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
      scrollLeft: 0,
    };
    this.dropped = false;
  }

  componentDidMount() {
    this.canvasWrapperDOM.addEventListener('scroll', this.onCanvasScroll);
    this.paper = this.context.paper.initialize();
    this._attachPaperEvents();
    jsPlumb.fire('canvasLoaded', this.paper);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loadingProject && !nextProps.loadingProject && !this.connectionsHandled) {
      this.connectionsHandled = true;
      setTimeout(this.handleInitialConnections);
    }
  }

  componentWillUnmount() {
    this.props.dispatch(actions.clearProject(true));
    this.canvasWrapperDOM.removeEventListener('scroll', this.onCanvasScroll);
    this.context.paper.stopRepaintingEverything();
  }

  handleInitialConnections = () => {
    const {store: {getState}} = this.context;
    const {initialConnections, entities: {functions, models}} = getState();
    initialConnections.forEach(({fromId, toId}) => {
      const portOut = document.getElementById(`port_out_${fromId}`);
      let portIn = document.getElementById(`port_in_${toId}`);
      if (functions[fromId] && models[toId]) {
        portIn = document.getElementById(`port_out_${toId}`);
      }
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

  isConnectionValid = (info) => {
    const {sourceId, newSourceId, targetId, newTargetId} = info;
    if (sourceId !== undefined) {
      if (sourceId === targetId) {
        return false;
      }
    } else if (newSourceId !== undefined) {
      if (newSourceId === newTargetId) {
        return false;
      }
    }
    const sourceElement = newSourceId || sourceId;
    const targetElement = newTargetId || targetId;
    if (Connections.connectionExists(sourceElement, targetElement)) {
      return false;
    }
    const source = document.querySelector(`#${sourceElement}`);
    const target = document.querySelector(`#${targetElement}`);
    if (!source || !target) return null;
    if ((source.parentElement.classList.contains('port-in') && target.parentElement.classList.contains('port-in')) ||
      (source.parentElement.classList.contains('port-out') && target.parentElement.classList.contains('port-out'))) {
      if ((source.parentElement.classList.contains('port-Function') && target.parentElement.classList.contains('port-Model')) ||
        (source.parentElement.classList.contains('port-Model') && target.parentElement.classList.contains('port-Function'))) {
        if (source.parentElement.classList.contains('port-in') && target.parentElement.classList.contains('port-in')) {
          return false;
        }
        return true;
      }
      return false;
    }
    return true;
  };

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

  discardReattachment = info => () => {
    const {originalSourceEndpoint, originalTargetEndpoint, connection} = info;
    const {suspendedElementType, suspendedElement} = connection;
    this._disconnect(connection);
    const isSuspendedTarget = suspendedElementType === 'target';
    const source = isSuspendedTarget ? originalSourceEndpoint.element : suspendedElement;
    const target = isSuspendedTarget ? suspendedElement : originalTargetEndpoint.element;
    this.paper.connect({source, target}, {fireEvent: false});
  }

  _attachPaperEvents = () => {
    const {store: {getState}} = this.context;
    this.paper.bind('connection', (info) => {
      const {
        source: {parentElement: {classList: source}},
        target: {parentElement: {classList: target}},
        connection,
      } = info;
      let fulfilled = null;
      if (source.contains('port-in')) {
        if (!(source.contains('port-Function') && target.contains('port-Model'))) {
          this._flipConnection(info);
          this._disconnect(connection);
          return;
        }
      }
      if (source.contains('port-out') && source.contains('port-Model') && target.contains('port-Function')) {
        this._flipConnection(info);
        this._disconnect(connection);
        return;
      }
      const isValid = this.isConnectionValid(info);
      if (isValid === null) {
        this._disconnect(connection);
        return;
      } else if (!isValid) {
        if (this.dropped) {
          this._disconnect(connection);
        } else {
          Connections.removeConnection(info.sourceId, info.targetId);
          Connections.addConnectionByInfo(info);
        }
        return;
      }
      let dropped = info.connection.getParameter('forceDropped') || this.dropped;
      this.dropped = false;
      // This is set when a connection is being moved (connect event is also
      // triggered). We want to handle this in 'connectionMoved' handler. Note
      // that this is *not* set when a connection is picked up and then dropped
      // in the same place.
      if (connection.suspendedElement) return;
      if (dropped) {
        fulfilled = this._executeStrategies(getState().plugins.onConnectionCreatedStrategy, info);
      }
      if (fulfilled === null) {
        Connections.addConnectionByInfo(info);
      } else if (fulfilled === false) {
        this._disconnect(connection);
      }
    });

    this.paper.bind('connectionMoved', (info) => {
      let fulfilled = false;
      this.dropped = false;
      if (this.isConnectionValid(info)) {
        fulfilled = this._executeStrategies(getState().plugins.onConnectionMovedStrategy, info);
      }
      if (fulfilled === null) {
        Connections.moveConnection(info);
      } else if (fulfilled === false) {
        // Have to save these values and call on next event loop iteration
        // because jsPlumb needs the connection to be intact to finish
        // processing this event after this handler is done.
        setTimeout(this.discardReattachment(info));
      }
    });

    this.paper.bind('connectionDetached', (info) => {
      let fulfilled = this._executeStrategies(getState().plugins.onConnectionDeletedStrategy, info);
      if (fulfilled === null) {
        Connections.removeConnection(info.sourceId, info.targetId);
      } else if (fulfilled === false) {
        this.paper.connect({
          source: info.source,
          target: info.target,
          fireEvent: false,
        });
      }
    });

    this.paper.bind('beforeDrop', () => {
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
    const {isPanelClosed, zoom} = this.props;
    const {scrollLeft} = this.state;
    const canvasHeight = isPanelClosed ? null : this.state.canvasHeight;
    return (
      <div>
        <section
          className="canvas"
          onClick={this.handleClick}
        >
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
        </section>
        <div className="canvas__zoom-area" />
      </div>
    );
  }
}

const selector = createSelector(
  state => !state.states.currentlyOpenedPanel,
  state => state.loadingProject,
  state => state.states.zoom,
  (
    isPanelClosed,
    loadingProject,
    zoom,
  ) => ({
    isPanelClosed,
    loadingProject,
    zoom,
  }),
);

export default connect(selector, null, null, {withRef: true})(Canvas);
