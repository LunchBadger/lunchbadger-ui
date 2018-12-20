import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import {IconSVG, ContextualInformationMessage} from '../../../';
import MultiEnvironment from './MultiEnvironment/MultiEnvironment';
import icons from '../../../icons';
import {actions as coreActions} from '../../../../reduxActions/actions';
import './MultiEnvironments.scss';

const {iconPlus, iconLeaf, iconMouse} = icons;

class MultiEnvironments extends Component {
  static propTypes = {
    environments: PropTypes.array,
    selected: PropTypes.number,
    select: PropTypes.func,
    disabled: PropTypes.bool,
  };

  handleSelect = index =>
    this.props.dispatch(coreActions.multiEnvironmentsSetSelected(index));

  handleToggleDelta = index => () =>
    this.props.dispatch(coreActions.multiEnvironmentsToggleDelta(index));

  handleToggleNameEdit = (index, edit) =>
    this.props.dispatch(coreActions.multiEnvironmentsToggleNameEdit({index, edit}));

  handleUpdateName = (index, name) =>
    this.props.dispatch(coreActions.multiEnvironmentsUpdateName({index, name}));

  add = () => this.props.dispatch(coreActions.multiEnvironmentsAdd());

  render() {
    const {environments, selected, disabled} = this.props;
    return (
      <div className={cs('MultiEnv', {disabled})}>
        {environments.map((item, idx) => (
          <MultiEnvironment
            key={idx}
            {...item}
            index={idx}
            selected={idx === selected}
            icon={idx === 0 ? iconLeaf : iconMouse}
            onClick={this.handleSelect}
            onToggleDelta={this.handleToggleDelta}
            onToggleNameEdit={this.handleToggleNameEdit}
            onUpdateName={this.handleUpdateName}
          />
        ))}
        {environments.length <= 4 && (
          <ContextualInformationMessage direction="bottom" tooltip="Create environment">
            <div className="MultiEnv__add" onClick={this.add}>
              <IconSVG svg={iconPlus} />
            </div>
          </ContextualInformationMessage>
        )}
      </div>
    );
  }
}

const selector = createSelector(
  state => state.multiEnvironments.environments,
  state => state.multiEnvironments.selected,
  (environments, selected) => ({environments, selected}),
);

export default connect(selector)(MultiEnvironments);
