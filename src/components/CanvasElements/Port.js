import React, {Component, PropTypes} from 'react';
import './Port.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';

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
        fillStyle: 'transparent'
      },
      connectorStyle: {
        lineWidth: 4,
        strokeStyle: '#ffffff',
        joinstyle: 'round',
        outlineColor: '#c1c1c1',
        outlineWidth: 2
      },
      anchor: ['Perimeter', { shape: 'Circle' }],
      scope: this.props.scope
    };

    this.props.paper.makeSource(portDOM, {
      endpoint: ['Dot', {radius: 6}],
      filter: '.port__inside',
      allowLoopback: false
    }, endpointOptions);

    this.props.paper.makeTarget(portDOM, {
      endpoint: ['Dot', {radius: 6}],
      filter: '.port__inside',
      allowLoopback: false
    }, endpointOptions);
  }

  componentWillUnmount() {
    this.props.paper.remove(findDOMNode(this.refs.port));

    // TODO:
    // remove connections attached to that port from Connection store
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
           className={`${portClass} ${this.props.className || ''}`}>
        <div className="port__inside">
        </div>
      </div>
    );
  }
}
