import React, {Component, PropTypes} from 'react';
import './Port.scss';
import {findDOMNode} from 'react-dom';

export default class Port extends Component {
  static propTypes = {
    way: PropTypes.oneOf(['in', 'out']).isRequired,
    scope: PropTypes.string.isRequired,
    paper: PropTypes.object.isRequired,
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
        anchor: [0.6, 0.1, 0, 0],
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
        anchor: [0.5, 0, 0.5, 0.5],
        scope: this.props.scope
      });
    }
  }

  render() {
    return (
      <div ref="port" className={`port ${this.props.className}`}>
        <div className="port__inside">
          <i className="port__icon fa fa-arrow-right"/>
        </div>
      </div>
    );
  }
}
