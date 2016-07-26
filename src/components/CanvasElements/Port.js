import React, {Component, PropTypes} from 'react';
import './Port.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import removeConnection from 'actions/Connection/remove';
import uuid from 'uuid';
import Connection from 'stores/Connection';
import _ from 'lodash';

export default class Port extends Component {
  static propTypes = {
    elementId: PropTypes.string.isRequired,
    way: PropTypes.oneOf(['in', 'out']).isRequired,
    scope: PropTypes.string.isRequired,
    paper: PropTypes.object.isRequired,
    middle: PropTypes.bool,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
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
        lineWidth: 4,
        strokeStyle: '#DF5F37',
        joinstyle: 'round',
        outlineColor: '#DF5F37',
        outlineWidth: 1
      },
      connectorHoverStyle: {
        outlineColor: '#FFFFFF'
      },
      anchor: [
        [0.5, 0, 0, -1, 0, 0, 'top'],
        [1, 0.5, 1, 0, 0, 0, 'right'],
        [0.5, 1, 0, 1, 0, 0, 'bottom'],
        [0, 0.5, -1, 0, 0, 0, 'left']
      ],
      scope: this.props.scope
    };

    this.props.paper.makeSource(portDOM, {
      endpoint: ['Dot', {radius: 4}],
      allowLoopback: false
    }, endpointOptions);

    this.props.paper.makeTarget(portDOM, {
      endpoint: ['Dot', {radius: 4}],
      allowLoopback: false,
      deleteEndpointsOnDetach: true
    }, endpointOptions);

    if (this.props.way === 'in') {
      this._checkAndReattachConnections();
    }
  }

  componentWillUnmount() {
    const portDOM = findDOMNode(this.refs.port);
    const connectionsOut = this.props.paper.select({source: portDOM});
    const connectionsIn = this.props.paper.select({target: portDOM});

    connectionsIn.each((connection) => {
      this.props.paper.detach(connection, {
        fireEvent: false,
        forceDetach: false
      });
    });

    connectionsOut.each((connection) => {
      this.props.paper.detach(connection, {
        fireEvent: false,
        forceDetach: false
      });
    });
  }

  _checkAndReattachConnections() {
    const connections = Connection.getConnectionsForTarget(this.props.elementId);

    _.forEach(connections, (connection) => {
      let source = null;

      if (connection.info.source) {
        source = connection.info.source.classList.contains('port__anchor') ? connection.info.source : connection.info.source.querySelector('.port__anchor')
      } else {
        source = document.querySelector(`#${connection.info.sourceId}`);
      }

      removeConnection(connection.fromId, connection.toId);

      this.props.paper.connect({
        source: source,
        target: findDOMNode(this.refs.port)
      });
    });
  }

  render() {
    const portClass = classNames({
      'canvas-element__port--out': this.props.way === 'out',
      'canvas-element__port--in': this.props.way === 'in',
      'canvas-element__port': true,
      'port': true,
      'port__middle': this.props.middle
    });

    let isConnected = false;

    if (this.props.way === 'out') {
      isConnected = Connection.search({fromId: this.props.elementId}).length;
    } else if (this.props.way === 'in') {
      isConnected = Connection.search({toId: this.props.elementId}).length;
    }

    const portAnchorClass = classNames({
      port__anchor: true,
      'port__anchor--connected': isConnected
    });

    return (
      <div id={`port_${this.props.way}_${this.props.elementId}`}
           className={`port-${this.props.way} ${portClass} ${this.props.className || ''}`}>
        <div className={portAnchorClass} ref="port" id={`port_${this.props.way}_${this.tempId}_${this.props.elementId}`}>
          <div className="port__inside">
          </div>
        </div>
      </div>
    );
  }
}
