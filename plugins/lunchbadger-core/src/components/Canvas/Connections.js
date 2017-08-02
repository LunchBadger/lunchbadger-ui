import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Connection from './Connection';

class Connections extends PureComponent {
  render() {
    const {connections} = this.props;
    return (
      <div>
        {connections.map((item, idx) => <Connection key={idx} {...item} />)}
      </div>
    )
  }
}

const selector = createSelector(
  state => state.connections,
  state => state.ports,
  (connections, ports) => ({
    connections: connections.filter(item =>
      ports.includes(`port_anchor_out_${item.fromId}`) &&
      ports.includes(`port_anchor_in_${item.toId}`)
    ),
  }),
);

export default connect(selector)(Connections);
