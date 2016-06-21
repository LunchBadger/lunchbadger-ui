import React, {Component, PropTypes} from 'react';
import './Port.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import removeConnection from 'actions/Connection/remove';

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
  }

  componentWillUnmount() {
    const connectionsOut = this.props.paper.select({source: `port_out_${this.props.elementId}`});
    const connectionsIn = this.props.paper.select({target: `port_in_${this.props.elementId}`});

    connectionsIn.each((connection) => {
      removeConnection(connection.sourceId, connection.targetId);

      this.props.paper.detach(connection, {
        fireEvent: false,
        forceDetach: false
      });
    });

    connectionsOut.each((connection) => {
      removeConnection(connection.sourceId, connection.targetId);
      
      this.props.paper.detach(connection, {
        fireEvent: false,
        forceDetach: false
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

    return (
      <div ref="port" id={`port_${this.props.way}_${this.props.elementId}`}
           className={`port-${this.props.way} ${portClass} ${this.props.className || ''}`}>
        <div className="port__inside">
        </div>
      </div>
    );
  }
}
