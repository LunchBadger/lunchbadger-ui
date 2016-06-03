import React, {Component, PropTypes} from 'react';
import './BasePlan.scss';
import PlanIcon from './PlanIcon';
import classNames from 'classnames';
import {DropTarget} from 'react-dnd';
import addUpgrade from 'actions/APIForecast/addUpgrade';
import addDowngrade from 'actions/APIForecast/addDowngrade';
import createForecast from 'actions/APIForecast/createForecast';
import moment from 'moment';

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    let upgradeDetails = {};

    // prevent dropping over same element
    if (item.entity.id === component.props.plan.id) {
      return;
    }

    const date = moment(component.props.date, 'M/YYYY').add(1, 'months');

    upgradeDetails = {
      fromPlan: item.entity,
      toPlan: component.props.plan,
      value: 0,
      date: date.format('M/YYYY')
    };

    createForecast(component.props.forecast, date);

    if (item.index < component.props.index) {
      addUpgrade(component.props.forecast, upgradeDetails);
    } else {
      addDowngrade(component.props.forecast, upgradeDetails);
    }

    if (typeof component.props.handleUpgradeCreation === 'function') {
      component.props.handleUpgradeCreation(date);
    }
  }
};

@DropTarget('planElement', boxTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class BasePlan extends Component {
  static propTypes = {
    plan: PropTypes.object.isRequired,
    forecast: PropTypes.object.isRequired,
    date: PropTypes.string.isRequired,
    handleClick: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isCurrent: PropTypes.bool,
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
      'base-plan--expanded': this.props.isCurrent
    });
    const {plan, date, connectDropTarget} = this.props;

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
