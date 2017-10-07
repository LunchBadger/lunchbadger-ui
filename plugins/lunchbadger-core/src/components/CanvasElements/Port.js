import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {inject, observer} from 'mobx-react';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import Connections from '../../stores/Connections';
import uuid from 'uuid';
import _ from 'lodash';
import './Port.scss';

@inject('connectionsStore') @observer
export default class Port extends PureComponent {
  static propTypes = {
    elementId: PropTypes.string.isRequired,
    way: PropTypes.oneOf(['in', 'out']).isRequired,
    scope: PropTypes.string.isRequired,
    middle: PropTypes.bool,
    className: PropTypes.string
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  componentWillMount() {
    this.paper = this.context.paper.getInstance();
    this.tempId = uuid.v4();
  }

  componentDidMount() {
    const portDOM = findDOMNode(this.refs.port);
    const endpointOptions = {
      maxConnections: -1,
      paintStyle: {
        fillStyle: '#DF5F37'
      },
      connectorStyle: {
        lineWidth: 3,
        strokeStyle: '#DF5F37',
        joinstyle: 'round',
        outlineColor: '#DF5F37',
        outlineWidth: 1
      },
      connectorHoverStyle: {
        outlineColor: '#FFFFFF'
      },
      anchor: [
        // [0.5, 0, 0, -1, 0, 0, 'top'],
        [1, 0.5, 1, 0, -6, 2, 'right'],
        // [0.5, 1, 0, 1, 0, 0, 'bottom'],
        [0, 0.5, -1, 0, 11, 2, 'left']
      ],
      scope: this.props.scope,
    };
    this.paper.makeSource(portDOM, {
      endpoint: ['Dot', {radius: 4}],
      allowLoopback: false,
      deleteEndpointsOnDetach: true
    }, endpointOptions);
    this.paper.makeTarget(portDOM, {
      endpoint: ['Dot', {radius: 4}],
      allowLoopback: false,
      deleteEndpointsOnDetach: true
    }, endpointOptions);
    if (this.props.way === 'in') {
      this._checkAndReattachTargetConnections();
    }
    if (this.props.way === 'out') {
      this._checkAndReattachSourceConnections();
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.scope !== this.props.scope) {
      const portDOM = findDOMNode(this.refs.port);
      this.paper.setTargetScope(portDOM, nextProps.scope);
      this.paper.setSourceScope(portDOM, nextProps.scope);
    }
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

  _checkAndReattachTargetConnections() {
    const {elementId, connectionsStore} = this.props;
    const targetConnections = connectionsStore.getConnectionsForTarget(elementId);
    _.forEach(targetConnections, (connection) => {
      let source = null;
      if (connection.info.source) {
        source = connection.info.source.classList.contains('port__anchor') ? connection.info.source : connection.info.source.querySelector('.port__anchor')
      } else {
        source = document.querySelector(`#${connection.info.sourceId}`);
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
        target = document.querySelector(`#${connection.info.targetId}`);
      }
      Connections.removeConnection(connection.fromId, connection.toId);
      this.paper.connect({
        source: findDOMNode(this.refs.port),
        target: target
      });
    });
  }

  render() {
    const {way, elementId, middle, className, connectionsStore} = this.props;
    const isConnected = connectionsStore.isPortConnected(way, elementId);
    const portClass = classNames('canvas-element__port', 'port', {
      'canvas-element__port--out': way === 'out',
      'canvas-element__port--in': way === 'in',
      'port__middle': middle,
    });
    const portAnchorClass = classNames('port__anchor', {
      'port__anchor--connected': isConnected,
    });
    return (
      <div ref="port__wrap">
        <div
          id={`port_${way}_${elementId}`}
          className={`port-${way} ${portClass} ${className || ''}`}
        >
          <div className={portAnchorClass} ref="port" id={`port_${way}_${this.tempId}_${elementId}`}>
            <div className="port__inside" />
          </div>
        </div>
      </div>
    );
  }
}
