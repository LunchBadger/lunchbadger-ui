import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './Port.scss';
import {findDOMNode} from 'react-dom';
import classNames from 'classnames';
import removeConnection from '../../actions/Connection/remove';
import uuid from 'uuid';
import Connection from '../../stores/Connection';
import {setPortDOMElement} from '../../reduxActions';
import _ from 'lodash';

class Port extends PureComponent {
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

  constructor(props) {
    super(props);
    this.portTopOffsets = {};
  }

  componentWillMount() {
    this.paper = this.context.paper.getInstance();
    this.tempId = uuid.v4();
  }

  componentDidMount() {
    const {way, elementId, dispatch} = this.props;
    const id = `port_anchor_${way}_${elementId}`;
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

    // if (this.props.way === 'in') {
    //   // this._checkAndReattachTargetConnections();
    // }
    // if (this.props.way === 'out') {
    //   // this._checkAndReattachSourceConnections();
    // }
    this.calculatePortTopOffsets();
    dispatch(setPortDOMElement(id));
  }

  componentWillUpdate(nextProps) {
    this.calculatePortTopOffsets();
    if (nextProps.offsetTop !== this.props.offsetTop) {
      this.forceUpdate();
    }
    if (nextProps.scope !== this.props.scope) {
      const portDOM = findDOMNode(this.refs.port);
      this.paper.setTargetScope(portDOM, nextProps.scope);
      this.paper.setSourceScope(portDOM, nextProps.scope);
    }
  }

  calculatePortTopOffsets = () => {
    const portWrapDOM = findDOMNode(this.refs.port__wrap);
    const subElementOffsetTop = portWrapDOM.closest('.EntitySubElements__main')
      ? portWrapDOM.closest('.EntitySubElements').getBoundingClientRect().top
      : 0;
    this.portTopOffsets[this.props.elementId] = (this.props.offsetTop || 0)
      + subElementOffsetTop
      - portWrapDOM.closest('.Entity__extra').getBoundingClientRect().top;
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

  _checkAndReattachTargetConnections = () => {
    const connections = this.props.targetConnections;
    _.forEach(connections, (connection) => {
      let source = null;
      if (connection.info && connection.info.source) {
        source = connection.info.source.classList.contains('port__anchor') ? connection.info.source : connection.info.source.querySelector('.port__anchor')
      } else {
        source = document.querySelector(`#port_anchor_out_${connection.fromId}`);
      }
      // removeConnection(connection.fromId, connection.toId);
      // console.log(990, {
      //   source,
      //   target: findDOMNode(this.refs.port),
      // });
      this.paper.connect({
        source,
        target: findDOMNode(this.refs.port),
      });
    });
  }

  _checkAndReattachSourceConnections = () => {
    const connections = this.props.sourceConnections; //Connection.getConnectionsForSource(this.props.elementId);
    _.forEach(connections, (connection) => {
      let target = null;
      if (connection.info && connection.info.target) {
        target = connection.info.target.classList.contains('port__anchor') ? connection.info.target : connection.info.target.querySelector('.port__anchor')
      } else {
        target = document.querySelector(`#port_anchor_in_${connection.toId}`);
      }
      // removeConnection(connection.fromId, connection.toId);
      // console.log(991, {
      //   source: findDOMNode(this.refs.port),
      //   target,
      // });
      this.paper.connect({
        source: findDOMNode(this.refs.port),
        target,
      });
    });
  }

  render() {
    const {way, middle, elementId, isConnected, className} = this.props;
    const portClass = classNames({
      'port': true,
      'canvas-element__port': true,
      'canvas-element__port--out': way === 'out',
      'canvas-element__port--in': way === 'in',
      'port__middle': middle,
    });
    const portAnchorClass = classNames({
      'port__anchor': true,
      'port__anchor--connected': isConnected,
    });
    return (
      <div ref="port__wrap">
        <div
          id={`port_${way}_${elementId}`}
          className={`port-${way} ${portClass} ${className || ''}`}
          style={{top: this.portTopOffsets[elementId]}}
        >
          <div className={portAnchorClass} ref="port" id={`port_anchor_${way}_${elementId}`}>
            <div className="port__inside" />
          </div>
        </div>
      </div>
    );
  }
}

const selector = createSelector(
  state => state.connections,
  (_, props) => props.elementId,
  (connections, id) => {
    const sourceConnections = connections.filter(({fromId}) => fromId === id);
    const targetConnections = connections.filter(({toId}) => toId === id);
    return {
      sourceConnections,
      targetConnections,
      isConnected: sourceConnections.length > 0 || targetConnections.length > 0,
    };
  },
);

export default connect(selector)(Port);
