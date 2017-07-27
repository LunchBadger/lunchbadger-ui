import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Tool from './Tool/Tool';
import cs from 'classnames';
import './Aside.scss';

class Aside extends Component {
  static propTypes = {
    disabled: PropTypes.bool,
    groups: PropTypes.array,
  }

  static defaultProps = {
    disabled: false,
  };

  static contextTypes = {
    store: PropTypes.object,
  }

  handleClick = action => action(this.context.store.dispatch);

  render() {
    const {disabled, groups} = this.props;
    return (
      <aside className={cs('Aside', {disabled})}>
        {groups.map((group, idx) => (
          <div key={idx} className="Aside__toolGroup">
            {group.map((tool, idxTool) => (
              <Tool key={idxTool} {...tool} onClick={this.handleClick} />
            ))}
          </div>
        ))}
      </aside>
    );
  }
}

const selector = createSelector(
  state => state.plugins.tools || [],
  tools => ({
    groups: Object.keys(tools).map(key => tools[key]),
  }),
);

export default connect(selector)(Aside);
