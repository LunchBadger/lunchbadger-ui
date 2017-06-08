import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import cs from 'classnames';
import {
  selectMultiEnvironment,
  addMultiEnvironment,
  toggleMultiEnvironmentDelta,
  toggleMultiEnvironmentNameEdit,
  updateMultiEnvironmentName,
} from '../../../actions';
import {IconSVG, ContextualInformationMessage} from '../../../';
import MultiEnvironment from './MultiEnvironment/MultiEnvironment';
import {iconPlus, iconLeaf, iconMouse} from '../../../../../../src/icons';
import './MultiEnvironments.scss';

class MultiEnvironments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      balloonVisible: false,
    };
  }

  select = index => this.props.select(index);

  toggleDelta = index => () => this.props.toggleDelta(index);

  toggleBalloon = balloonVisible => () => this.setState({balloonVisible});

  add = () => {
    this.toggleBalloon(false)();
    this.props.add();
  }

  render() {
    const {environments, selected, add, onToggleNameEdit, onUpdateName, disabled} = this.props;
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
            onClick={this.select}
            onToggleDelta={this.toggleDelta}
            onToggleNameEdit={onToggleNameEdit}
            onUpdateName={onUpdateName}
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

MultiEnvironments.propTypes = {
  environments: PropTypes.array,
  selected: PropTypes.number,
  select: PropTypes.func,
  disabled: PropTypes.bool,
}

const mapStateToProps = state => ({
  environments: state.ui.multiEnvironments.environments,
  selected: state.ui.multiEnvironments.selected,
});

const mapDispatchToProps = dispatch => ({
  select: index => dispatch(selectMultiEnvironment(index)),
  add: () => dispatch(addMultiEnvironment()),
  toggleDelta: index => dispatch(toggleMultiEnvironmentDelta(index)),
  onToggleNameEdit: (index, edit) => dispatch(toggleMultiEnvironmentNameEdit(index, edit)),
  onUpdateName: (index, name) => dispatch(updateMultiEnvironmentName(index, name)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MultiEnvironments);
