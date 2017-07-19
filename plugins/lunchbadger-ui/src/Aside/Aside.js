import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import Tool from './Tool/Tool';
import cs from 'classnames';
import './Aside.scss';

class Aside extends Component {
  handleClick = action => action(this.props.dispatch);

  render() {
    const {disabled, groups, dispatch} = this.props;
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

Aside.propTypes = {
  disabled: PropTypes.bool,
};

Aside.defaultProps = {
  disabled: false,
};

const selector = createSelector(
  state => state.plugins.tools || [],
  tools => ({
    groups: Object.keys(tools).map(key => tools[key]),
  }),
);

const mapDispatchToProps = dispatch => ({
  dispatch,
});

export default connect(selector, mapDispatchToProps)(Aside);
