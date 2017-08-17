import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import {setCurrentElement, setCurrentEditElement} from '../../../lunchbadger-core/src/reduxActions';
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

  handleClick = action => {
    const {store: {dispatch}} = this.context;
    const entity = dispatch(action());
    dispatch(setCurrentElement(entity));
    dispatch(setCurrentEditElement(entity));
  }

  render() {
    const {disabled, groups, currentType} = this.props;
    return (
      <aside className={cs('Aside', {disabled})}>
        {groups.map((group, idx) => (
          <div key={idx} className="Aside__toolGroup">
            {group.map((tool, idxTool) => (
              <Tool
                key={idxTool}
                {...tool}
                onClick={this.handleClick}
                selected={currentType.endsWith(tool.name.toLowerCase())}
              />
            ))}
          </div>
        ))}
      </aside>
    );
  }
}

const selector = createSelector(
  state => state.plugins.tools || [],
  state => state.states.currentEditElement,
  (tools, currentElement) => ({
    groups: Object.keys(tools).map(key => tools[key]),
    currentType: currentElement && !currentElement.loaded ? currentElement.constructor.type.toLowerCase() : '',
  }),
);

export default connect(selector)(Aside);
