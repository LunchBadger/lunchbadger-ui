import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import {DropTarget} from 'react-dnd';
import moment from 'moment';
import {addUpgrade, addDowngrade} from '../../../reduxActions/forecasts';
import {USER_POOL} from './UserPoolIcon';
import PlanIcon from './PlanIcon';
import './BasePlan.scss';

const boxTarget = {
  drop(_props, monitor, component) {
    const item = monitor.getItem();
    const date = moment(component.props.date, 'M/YYYY');
    if (date.isSameOrBefore(moment(), 'month')) {
      return;
    }
    // handle user pool drop
    if (item.type === USER_POOL) {
      _props.dispatch(addUpgrade(component.props.forecast, {
        fromPlan: null,
        toPlan: component.props.plan,
        value: 0,
        date: date.format('M/YYYY')
      }));
    } else {
      // prevent dropping over same element
      if (item.entity.id === component.props.plan.id) return;
      const upgradeDetails = {
        fromPlan: item.entity,
        toPlan: component.props.plan,
        value: 0,
        date: date.format('M/YYYY')
      };
      if (item.index < component.props.index) {
        _props.dispatch(addUpgrade(component.props.forecast, upgradeDetails));
      } else {
        _props.dispatch(addDowngrade(component.props.forecast, upgradeDetails));
      }
    }
    if (typeof component.props.handleUpgradeCreation === 'function') {
      component.props.handleUpgradeCreation(date);
    }
  }
};

@DropTarget('planElement', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  isOverCurrent: monitor.isOver({shallow: true})
}))

class BasePlan extends Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    forecast: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isCurrent: PropTypes.bool,
    isOver: PropTypes.bool.isRequired,
    handleUpgradeCreation: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      hasDropped: false,
    }
  }

  render() {
    const elementClass = classNames({
      'base-plan': true,
      'base-plan--over': this.props.isOver,
      'base-plan--expanded': this.props.isCurrent
    });
    const {date, plan, connectDropTarget} = this.props;
    return connectDropTarget(
      <div
        className={elementClass}
        onClick={() => this.props.handleClick()}
      >
        <PlanIcon
          index={this.props.index}
          changed={plan.findDetail({date: date, changed: true}) ? true : false}
          entity={plan}
        />
      </div>
    )
  }
}

export default connect(null)(BasePlan);
