import React, {Component, PropTypes} from 'react';
import './BasePlan.scss';
import PlanIcon from './PlanIcon';
import classNames from 'classnames';
import {DropTarget} from 'react-dnd';
import addUpgrade from 'actions/APIForecast/addUpgrade';

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();

    if (item.entity.id === component.props.plan.id) {
      return;
    }

    addUpgrade(component.props.forecast, {
      fromPlan: item.entity,
      toPlan: component.props.plan,
      value: 0,
      date: component.props.date
    });
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
    isCurrent: PropTypes.bool
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
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className={elementClass}
           onClick={() => this.props.handleClick()}>
        <PlanIcon entity={this.props.plan}/>
      </div>
    )
  }
}
