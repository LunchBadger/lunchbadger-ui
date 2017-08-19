import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import {IconSVG, ContextualInformationMessage} from '../../../';
import MultiEnvironment from './MultiEnvironment/MultiEnvironment';
import {iconPlus, iconLeaf, iconMouse} from '../../../../../../src/icons';
import {actions as coreActions} from '../../../../../../plugins/lunchbadger-core/src/reduxActions/actions';
import './MultiEnvironments.scss';

class MultiEnvironments extends Component {
  static propTypes = {
    environments: PropTypes.array,
    selected: PropTypes.number,
    select: PropTypes.func,
    disabled: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.state = {
      balloonVisible: false,
    };
  }

  handleSelect = index =>
    this.props.dispatch(coreActions.multiEnvironmentsSetSelected(index));

  handleToggleDelta = index => () =>
    this.props.dispatch(coreActions.multiEnvironmentsToggleDelta(index));

  toggleBalloon = balloonVisible => () => this.setState({balloonVisible});

  handleToggleNameEdit = (index, edit) =>
    this.props.dispatch(coreActions.multiEnvironmentsToggleNameEdit({index, edit}));

  handleUpdateName = (index, name) =>
    this.props.dispatch(coreActions.multiEnvironmentsUpdateName({index, name}));

  add = () => {
    this.toggleBalloon(false)();
    this.props.dispatch(coreActions.multiEnvironmentsAdd());
  }

  render() {
    const {environments, selected, disabled} = this.props;
    const {balloonVisible} = this.state;
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
          <div
            className="MultiEnv__add"
            onClick={this.add}
            onMouseEnter={this.toggleBalloon(true)}
            onMouseLeave={this.toggleBalloon(false)}
          >
            <IconSVG svg={iconPlus} />
            {balloonVisible && (
              <ContextualInformationMessage type={environments.length === 1 ? 'left' : undefined}>
                Create environment
              </ContextualInformationMessage>
            )}
          </div>
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
