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

    if (this.props.way === 'in') {
      this.props.paper.makeTarget(portDOM, {
        maxConnections: -1,
        endpoint: 'Blank',
        paintStyle: {
          fillStyle: '#ffffff'
        },
        dropOptions: {
          hoverClass: 'hover',
          activeClass: 'active'
        },
        anchor: [0.5, 0.5, 0, 0],
        scope: this.props.scope
      });
    } else {
      this.props.paper.makeSource(portDOM, {
        maxConnections: -1,
        endpoint: 'Blank',
        paintStyle: {
          fillStyle: '#ffffff'
        },
        connectorStyle: {
          lineWidth: 6,
          strokeStyle: '#ffffff',
          joinstyle: 'round',
          outlineColor: '#c1c1c1',
          outlineWidth: 2
        },
        connectorHoverStyle: {
          outlineColor: '#919191'
        },
        anchor: [0.7, 0.5, 1, 1],
        scope: this.props.scope
      });
    }
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
          <i className="port__icon fa fa-arrow-right"/>
        </div>
      </div>
    );
  }
}
