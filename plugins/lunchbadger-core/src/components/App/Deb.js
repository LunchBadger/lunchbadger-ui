import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import './Deb.scss';

class Deb extends PureComponent {
  render() {
    const {tools} = this.props;
    const data = JSON.stringify({
      tools,
    })
    return (
      <div className="Deb">
        {data}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.plugins.tools,
  (
    tools,
  ) => ({
    tools: Object.values(tools).map(t => t.map(({name}) => name)),
  }),
);

export default connect(selector)(Deb);
