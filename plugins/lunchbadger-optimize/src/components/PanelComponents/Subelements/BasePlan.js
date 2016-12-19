import React, {Component, PropTypes} from 'react';
import './BasePlan.scss';
import PlanIcon from './PlanIcon';
import classNames from 'classnames';
import {DropTarget} from 'react-dnd';
import addUpgrade from '../../../actions/APIForecast/addUpgrade';
import addDowngrade from '../../../actions/APIForecast/addDowngrade';
import moment from 'moment';
import {USER_POOL} from './UserPoolIcon';

const boxTarget = {
  drop(_props, monitor, component) {
    const item = monitor.getItem();
    const date = moment(component.props.date, 'M/YYYY');

    if (date.isSameOrBefore(moment(), 'month')) {
      return;
    }

    // handle user pool drop
    if (item.type === USER_POOL) {
      addUpgrade(component.props.forecast, {
        fromPlan: null,
        toPlan: component.props.plan,
        value: 0,
        date: date.format('M/YYYY')
      });
    } else {
      // prevent dropping over same element
      if (item.entity.id === component.props.plan.id) {
        return;
      }

      const upgradeDetails = {
        fromPlan: item.entity,
        toPlan: component.props.plan,
        value: 0,
        date: date.format('M/YYYY')
      };

      if (item.index < component.props.index) {
        addUpgrade(component.props.forecast, upgradeDetails);
      } else {
        addDowngrade(component.props.forecast, upgradeDetails);
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
export default class BasePlan extends Component {
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
      hasDropped: false
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
      <div className={elementClass}
           onClick={() => this.props.handleClick()}>
        <PlanIcon index={this.props.index}
                  changed={plan.findDetail({date: date, changed: true}) ? true : false}
                  entity={plan}/>
      </div>
    )
  }
}
