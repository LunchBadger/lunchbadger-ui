import React, {Component, PropTypes} from 'react';
import './UpgradeSlider.scss';
import Slider from 'rc-slider';
import PlanInfoTooltip from './PlanInfoTooltip';
import upgradePlan from 'actions/APIForecast/upgradePlan';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';

export default class UpgradeSlider extends Component {
  static propTypes = {
    forecast: PropTypes.object.isRequired,
    upgrade: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      movedUsers: 0,
      max: 10,
      value: props.upgrade.value
    }
  }

  componentWillMount() {
    const {forecast, upgrade} = this.props;

    this.fromPlan = forecast.api.findPlan({id: upgrade.fromPlanId});
    this.toPlan = forecast.api.findPlan({id: upgrade.toPlanId});

    const recalculatedUsers = this._recalculateUsers(upgrade.value);

    this.planUsers = this.fromPlan.findDetail({date: upgrade.date}).subscribers.sum;

    this.setState({
      movedUsers: recalculatedUsers,
      max: Math.ceil((upgrade.value || 1) / 10) * 10
    });
  }

  _recalculateUsers(value) {
    const planDetails = this.fromPlan.findDetail({date: this.props.upgrade.date});

    return Math.round(planDetails.subscribers.sum * (value / 100));
  }

  _handleOnChange(value) {
    const {forecast, upgrade} = this.props;
    const {max} = this.state;
    const userCount = this.fromPlan.getCountAfterDowngradesAtDate(upgrade.date, forecast.api);

    // don't allow to change value to higher if no more users are available to transit between plans
    if (userCount < 1 && value > this.state.value) {
      value = this.state.value;
    }

    const recalculatedUsers = this._recalculateUsers(value);

    upgradePlan(forecast, {
      fromPlanId: upgrade.fromPlanId,
      toPlanId: upgrade.toPlanId,
      date: upgrade.date,
      value: value
    });

    this.setState({
      value: value,
      movedUsers: recalculatedUsers
    });

    if (value === max && max < 100) {
      this.setState({max: max + 10});
    }
  }

  render() {
    const minPercentage = 0;
    const maxPercentage = this.state.max;

    const percentFormatter = (value) => {
      return value + ' %';
    };

    return (
      <div className="upgrade-slider">
        <div className="upgrade-slider__legend">
          <div className="upgarde-slider__legend__value">
            {numeral(this.state.movedUsers).format('0,0')}
            <PlanInfoTooltip forecast={this.props.forecast} plan={this.fromPlan} date={this.props.upgrade.date}/>
          </div>
          <div className="upgrade-slider__legend__name">
            Users
            {' '}
            {this.props.upgrade.downgrade ? 'downgraded from' : 'upgraded from'}
            {' '}
            {this.fromPlan.name}
            {' '}
            to
            {' '}
            {this.toPlan.name}
          </div>
        </div>
        <div className="upgrade-slider__slider">
          <Slider
            disabled={moment(this.props.upgrade.date, 'M/YYYY').isSameOrBefore(moment(), 'month')}
            step={0.01}
            tipFormatter={percentFormatter}
            defaultValue={this.props.upgrade.value}
            value={this.state.value}
            onChange={_.throttle(this._handleOnChange.bind(this), 600)}
            min={minPercentage}
            max={maxPercentage}/>
          <div className="upgrade-slider__slider-legend">
            <div className="upgrade-slider__slider-legend__value upgrade-slider__slider-legend__value--left">
              {minPercentage}%
            </div>
            <div className="upgrade-slider__slider-legend__value upgrade-slider__slider-legend__value--right">
              {maxPercentage}%
            </div>
          </div>
        </div>
      </div>
    );
  }
}
