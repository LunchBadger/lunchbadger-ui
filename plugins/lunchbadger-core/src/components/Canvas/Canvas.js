import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import QuadrantContainer from '../Quadrant/QuadrantContainer';
import Connections from '../../stores/Connections';
import {clearCurrentElement} from '../../reduxActions';
import {actions} from '../../reduxActions/actions';
import {GAEvent} from '../../../../lunchbadger-ui/src';
import './Canvas.scss';

const defaultCanvasHeight = 'calc(100vh - 52px)';

class Canvas extends Component {
  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      lastUpdate: new Date(),
      scrollLeft: 0,
    };
    this.dropped = false;
  }

  componentDidMount() {
    window.addEventListener('connectPorts', this.connectPorts);
    window.addEventListener('disconnectPorts', this.disconnectPorts);
    this.canvasWrapperDOM.addEventListener('scroll', this.onCanvasScroll);
    this.paper = this.context.paper.initialize();
    this._attachPaperEvents();
    jsPlumb.fire('canvasLoaded', this.paper);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.loadingProject && !nextProps.loadingProject && !this.connectionsHandled) {
      this.connectionsHandled = true;
      this.handleInitialConnections();
    }
  }

  componentWillUnmount() {
    window.removeEventListener('connectPorts', this.connectPorts);
    window.removeEventListener('disconnectPorts', this.disconnectPorts);
    this.props.dispatch(actions.clearProject(true));
    if (this.canvasWrapperDOM) {
      this.canvasWrapperDOM.removeEventListener('scroll', this.onCanvasScroll);
    }
    this.context.paper.stopRepaintingEverything();
  }

  connectPorts = ({detail: {from, to, callback}}) => {
    this.paper.connect({
      source: document.querySelector(from).querySelector('.port__anchor'),
      target: document.querySelector(to).querySelector('.port__anchor'),
      parameters: {
        forceDropped: true,
      }
    }, {
      fireEvent: true,
    });
    setTimeout(callback);
  };

  disconnectPorts = ({detail: {from, to, callback}}) => {
    const fromElement = document.querySelector(from);
    const toElement = document.querySelector(to);
    this.paper.detach({
      source: fromElement.querySelector('.port__anchor'),
      target: toElement.querySelector('.port__anchor'),
      parameters: {
        forceDropped: true,
      }
    }, {
      fireEvent: true,
    });
    Connections.removeFromHistory(fromElement.id, toElement.id);
    setTimeout(callback);
  };

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
    if (source.parentElement.classList.contains('port__disabled')) return false;
    if (target.parentElement.classList.contains('port__disabled')) return false;
    if ((source.parentElement.classList.contains('port-in') && target.parentElement.classList.contains('port-in')) ||
      (source.parentElement.classList.contains('port-out') && target.parentElement.classList.contains('port-out'))) {
      if ((source.parentElement.classList.contains('port-Function_') && target.parentElement.classList.contains('port-Model')) ||
        (source.parentElement.classList.contains('port-Model') && target.parentElement.classList.contains('port-Function_'))) {
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
      if (source.contains('port-in') && target.contains('port-out')) {
        if (!(source.contains('port-Function_') && target.contains('port-Model'))) {
          this._flipConnection(info);
          this._disconnect(connection);
          return;
        }
      }
      if (source.contains('port-out') && source.contains('port-Model') && target.contains('port-Function_')) {
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
      if (dropped) {
        const sourceGaType = connection.source.getAttribute('data-ga-type');
        const targetGaType = connection.target.getAttribute('data-ga-type');
        GAEvent('Canvas', 'Connected Entities', `${sourceGaType}-${targetGaType}`);
      }
      const isFunctionModelConn = true
        && source.contains('port-out')
        && source.contains('port-Function_')
        && target.contains('port-out')
        && target.contains('port-Model');
      const isDatasourceFunctionConn = true
        && source.contains('port-out')
        && source.contains('port-DataSource')
        && target.contains('port-in')
        && target.contains('port-Function_');
      if (isFunctionModelConn || isDatasourceFunctionConn) {
        connection.addType('dashed');
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
      const {
        originalSourceEndpoint: {element: originalSourceEndpoint},
        originalTargetEndpoint: {element: originalTargetEndpoint},
        newSourceEndpoint: {element: newSourceEndpoint},
        newTargetEndpoint: {element: newTargetEndpoint},
      } = info;
      const originalSourceGaType = originalSourceEndpoint.getAttribute('data-ga-type');
      const originalTargetGaType = originalTargetEndpoint.getAttribute('data-ga-type');
      const newSourceGaType = newSourceEndpoint.getAttribute('data-ga-type');
      const newTargetGaType = newTargetEndpoint.getAttribute('data-ga-type');
      const gaLog = `${originalSourceGaType}-${originalTargetGaType} => ${newSourceGaType}-${newTargetGaType}`;
      GAEvent('Canvas', 'Reconnected Entities', gaLog);
      const source = newSourceEndpoint.parentElement.classList;
      const target = newTargetEndpoint.parentElement.classList;
      const isFunctionModelConn = true
        && source.contains('port-out')
        && target.contains('port-out')
        && (
          (source.contains('port-Function_') && target.contains('port-Model'))
          ||
          (source.contains('port-Model') && target.contains('port-Function_'))
        );
      const isDatasourceFunctionConn = true
        && source.contains('port-out')
        && target.contains('port-in')
        && source.contains('port-DataSource')
        && target.contains('port-Function_');
      info.connection.removeType('dashed');
      if (isFunctionModelConn || isDatasourceFunctionConn) {
        info.connection.addType('dashed');
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
      const sourceGaType = info.connection.source.getAttribute('data-ga-type');
      const targetGaType = info.connection.target.getAttribute('data-ga-type');
      GAEvent('Canvas', 'Disconnected Entities', `${sourceGaType}-${targetGaType}`);
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
    const {height, currentlyOpenedPanel} = this.props;
    const {scrollLeft} = this.state;
    const style = {height};
    const disabled = height !== defaultCanvasHeight && currentlyOpenedPanel === 'SETTINGS_PANEL';
    return (
      <div>
        <section
          style={style}
          className={cs('canvas', {disabled})}
          onClick={this.handleClick}
        >
          <div
            style={style}
            className="canvas__wrapper"
            ref={(r) => {this.canvasWrapperDOM = r;}}
          >
            <div style={style} className="canvas__legend">
              <div className="canvas__label canvas__label--left">Producers</div>
              <div className="canvas__label canvas__label--right">Consumers</div>
            </div>
            <QuadrantContainer
              className="canvas__container"
              id="canvas"
              scrollLeft={scrollLeft}
              style={{height}}
            />
          </div>
        </section>
        <div className="canvas__zoom-area" />
      </div>
    );
  }
}

const selector = createSelector(
  state => state.loadingProject,
  state => state.canvasHeight,
  state => state.states.currentlyOpenedPanel,
  (
    loadingProject,
    canvasHeight,
    currentlyOpenedPanel,
  ) => ({
    loadingProject,
    height: canvasHeight || defaultCanvasHeight,
    currentlyOpenedPanel,
  }),
);

export default connect(selector, null, null, {withRef: true})(Canvas);
