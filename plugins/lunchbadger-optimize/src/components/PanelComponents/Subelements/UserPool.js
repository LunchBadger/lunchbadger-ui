import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UserPoolIcon, {USER_POOL} from './UserPoolIcon';
import {DropTarget} from 'react-dnd';
import addDowngrade from '../../../actions/APIForecast/addDowngrade';
import './UserPool.scss';
import moment from 'moment';

const boxTarget = {
  drop(_props, monitor, component) {
    const item = monitor.getItem();
    const date = moment(component.props.date, 'M/YYYY');

    if (date.isSameOrBefore(moment(), 'month')) {
      return;
    }

    if (item.type === USER_POOL) {
      return;
    }

    addDowngrade(component.props.forecast, {
      fromPlan: item.entity,
      toPlan: null,
      value: 0,
      date: date.format('M/YYYY')
    });
  }
};

@DropTarget('planElement', boxTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class UserPool extends Component {
  static propTypes = {
    connectDropTarget: PropTypes.func.isRequired,
    date: PropTypes.string.isRequired,
    forecast: PropTypes.object.isRequired
  };

  render() {
    const {connectDropTarget} = this.props;

    return connectDropTarget(
      <div className="user-pool">
        <div className="user-pool__title">User Pool</div>
        <UserPoolIcon/>
      </div>
    );
  }
}
