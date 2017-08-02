import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
// import {createSelector} from 'reselect';

class Connection extends PureComponent {
  static contextTypes = {
    paper: PropTypes.object,
  }

  componentDidMount() {
    this.paper = this.context.paper.getInstance();
    const {fromId, toId} = this.props;
    const source = document.getElementById(`port_anchor_out_${fromId}`);
    const target = document.getElementById(`port_anchor_in_${toId}`);
    this.paper.connect({
      source,
      target,
    });
  }
  render() {
    return null;
  }
}

// const select = createSelector(
//
// );

// export default connect(selector)(Connections);
export default Connection;
