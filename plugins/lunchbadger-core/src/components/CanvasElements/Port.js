import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {inject, observer} from 'mobx-react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import Connections from '../../stores/Connections';
import uuid from 'uuid';
import _ from 'lodash';
import './Port.scss';

@inject('connectionsStore') @observer
class Port extends PureComponent {
  static propTypes = {
    elementId: PropTypes.string.isRequired,
    way: PropTypes.oneOf(['in', 'out']).isRequired,
    scope: PropTypes.string.isRequired,
    middle: PropTypes.bool,
    className: PropTypes.string,
    disabled: PropTypes.bool,
    gaType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    disabled: false,
  }

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.highlighted = [];
  }

  componentWillMount() {
    this.paper = this.context.paper.getInstance();
    this.tempId = uuid.v4();
  }

  componentDidMount() {
    const portDOM = findDOMNode(this.refs.port);
    const {way, scope} = this.props;
    const endpointOptions = {
      maxConnections: -1,
      paintStyle: {
        fillStyle: '#DF5F37'
      },
      connectorStyle: {
        lineWidth: 5,
        strokeStyle: '#DF5F37',
        joinstyle: 'round',
        outlineColor: '#0000',
        outlineWidth: 1
      },
      anchor: [
        [1, 0.5, 1, 0, -5, 2, 'right'],
        [0, 0.5, -1, 0, 8, 2, 'left']
      ],
      scope,
    };
    this.paper.makeSource(portDOM, {
      endpoint: ['Dot', {radius: 6}],
      allowLoopback: false,
      deleteEndpointsOnDetach: true
    }, endpointOptions);
    this.paper.makeTarget(portDOM, {
      endpoint: ['Dot', {radius: 6}],
      allowLoopback: false,
      deleteEndpointsOnDetach: true
    }, endpointOptions);
    if (way === 'in') {
      this._checkAndReattachTargetConnections();
    }
    if (way === 'out') {
      this._checkAndReattachSourceConnections();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.scope !== this.props.scope) {
      const portDOM = findDOMNode(this.refs.port);
      this.paper.setTargetScope(portDOM, nextProps.scope);
      this.paper.setSourceScope(portDOM, nextProps.scope);
    }
    const {currentElement, currentlySelectedSubelements, way, elementId} = nextProps;
    this.processHiglightedConnections(currentElement, currentlySelectedSubelements, way, elementId);
  }

  componentWillUnmount() {
    const portDOM = findDOMNode(this.refs.port);
    const connectionsOut = this.paper.select({source: portDOM});
    const connectionsIn = this.paper.select({target: portDOM});
    connectionsIn.each((connection) => {
      this.paper.detach(connection, {
        fireEvent: false,
        forceDetach: false,
      });
    });
    connectionsOut.each((connection) => {
      this.paper.detach(connection, {
        fireEvent: false,
        forceDetach: false,
      });
    });
  }

  processHiglightedConnections = (currentElement, currentlySelectedSubelements, way, elementId) => {
    const highlighted = this.getHighlightedConnections(currentElement, currentlySelectedSubelements, way, elementId);
    if (highlighted !== this.highlighted) {
      try {
        this.highlighted.forEach(({connection}) => {
          connection.removeType('highlighted');
          connection.endpoints.forEach(endpoint => endpoint.removeType('highlighted'));
        });
      } catch (e) {}
      this.highlighted = highlighted;
      this.highlighted.forEach(({connection}) => {
        if (connection) {
          connection.addType('highlighted');
          connection.endpoints.forEach(endpoint => endpoint.addType('highlighted'));
        }
      });
    }
  }

  getHighlightedConnections = (currentElement, currentlySelectedSubelements, way, elementId) => {
    const {entities} = this.context.store.getState();
    if (currentElement) {
      const {id, type} = currentElement;
      if (entities[type] && entities[type][id]) {
        return entities[type][id]
          .connectedPorts(currentlySelectedSubelements)
          .filter(item => item[elementId] === way);
      }
    }
    return [];
  };

  _checkAndReattachTargetConnections() {
    const {elementId, connectionsStore} = this.props;
    const targetConnections = connectionsStore.getConnectionsForTarget(elementId);
    _.forEach(targetConnections, (connection) => {
      let source = null;
      if (connection.info.source) {
        source = connection.info.source.classList.contains('port__anchor') ? connection.info.source : connection.info.source.querySelector('.port__anchor')
      } else {
        source = document.getElementById(connection.info.sourceId);
      }
      Connections.removeConnection(connection.fromId, connection.toId);
      this.paper.connect({
        source: source,
        target: findDOMNode(this.refs.port)
      });
    });
  }

  _checkAndReattachSourceConnections() {
    const {elementId, connectionsStore} = this.props;
    const sourceConnections = connectionsStore.getConnectionsForSource(elementId);
    _.forEach(sourceConnections, (connection) => {
      let target = null;
      if (connection.info.target) {
        target = connection.info.target.classList.contains('port__anchor') ? connection.info.target : connection.info.target.querySelector('.port__anchor')
      } else {
        target = document.getElementById(connection.info.targetId);
      }
      Connections.removeConnection(connection.fromId, connection.toId);
      this.paper.connect({
        source: findDOMNode(this.refs.port),
        target: target
      });
    });
  }

  render() {
    const {
      way,
      elementId,
      middle,
      className,
      connectionsStore,
      disabled,
      currentElement,
      currentlySelectedSubelements,
      gaType,
    } = this.props;
    const isConnected = connectionsStore.isPortConnected(way, elementId);
    const portClass = classNames('canvas-element__port', 'port', {
      'canvas-element__port--out': way === 'out',
      'canvas-element__port--in': way === 'in',
      'port__middle': middle,
      'port__disabled': disabled,
    });
    let highlighted = false;
    const {entities} = this.context.store.getState();
    if (currentElement) {
      const {id, type} = currentElement;
      if (entities[type] && entities[type][id]) {
        highlighted = !!entities[type][id].connectedPorts(currentlySelectedSubelements)
          .find(item => item[elementId] === way);
      }
    }
    const portAnchorClass = classNames('port__anchor', {
      'port__anchor--connected': isConnected,
      'port__anchor--highlighted': highlighted,
    });
    return (
      <div
        ref="port__wrap"
        className={`port__wrap__${way}`}
      >
        <div
          id={`port_${way}_${elementId}`}
          className={`port-${way} ${portClass} ${className || ''}`}
        >
          <div
            ref="port"
            id={`port_${way}_${this.tempId}_${elementId}`}
            className={portAnchorClass}
            data-ga-type={gaType}
          >
            <div className="port__inside" />
          </div>
        </div>
      </div>
    );
  }
}

const connector = createSelector(
  state => state.states.currentElement,
  state => (state.states.currentlySelectedSubelements || []).map(({id}) => id),
  state => state.loadedProject,
  (
    currentElement,
    currentlySelectedSubelements,
    loadedProject,
  ) => ({
    currentElement,
    currentlySelectedSubelements,
    loadedProject,
  }),
);

export default connect(connector)(Port);
