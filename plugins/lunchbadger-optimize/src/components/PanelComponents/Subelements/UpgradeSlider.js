import React, {Component, PropTypes} from 'react';
import './UpgradeSlider.scss';
import Slider from 'rc-slider';
import PlanInfoTooltip from './PlanInfoTooltip';
import upgradePlan from '../../../actions/APIForecast/upgradePlan';
import removeUpgrade from '../../../actions/APIForecast/removeUpgrade';
import numeral from 'numeral';
import moment from 'moment';
import _ from 'lodash';

export default class UpgradeSlider extends Component {
  static propTypes = {
    forecast: PropTypes.object.isRequired,
    upgrade: PropTypes.object.isRequired,
    upgrades: PropTypes.array.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      movedUsers: 0,
      max: 10,
      value: props.upgrade.value,
      maxChange: 0
    }
  }

  componentWillMount() {
    const {forecast, upgrade} = this.props;

    this.fromPlan = forecast.api.findPlan({id: upgrade.fromPlanId});
    this.toPlan = forecast.api.findPlan({id: upgrade.toPlanId});
    this.planUsers = this.fromPlan.findDetail({date: upgrade.date}).subscribers.sum;

    const recalculatedUsers = this._recalculateUsers(upgrade.value);

    this.setState({
      movedUsers: recalculatedUsers,
      max: Math.ceil((upgrade.value || 1) / 10) * 10
    });

    this._calculateChangeLimit(this.props.upgrades);
  }

  componentWillReceiveProps(nextProps) {
    this._calculateChangeLimit(nextProps.upgrades);
  }

  _calculateChangeLimit(upgrades) {
    let maxChange = 100;

    const filteredDowngrades = _.filter(upgrades, (upgrade) => {
      return upgrade.fromPlanId === this.fromPlan.id && upgrade.downgrade && upgrade.id !== this.props.upgrade.id;
    });

    const filteredUpgrades = _.filter(upgrades, (upgrade) => {
      return upgrade.fromPlanId === this.fromPlan.id && !upgrade.downgrade && upgrade.id !== this.props.upgrade.id;
    });

    filteredDowngrades.forEach((downgrade) => {
      // churn
      if (downgrade.toPlanId === null) {
        maxChange -= Math.round(downgrade.value / this.planUsers * 1000000) / 10000;
      } else {
        maxChange -= downgrade.value;
      }
    });

    filteredUpgrades.forEach((upgrade) => {
      maxChange -= upgrade.value;
    });

    this.setState({maxChange: maxChange});
  }

  _recalculateUsers(value) {
    return Math.round(this.planUsers * (value / 100));
  }

  _handleOnChange(value) {
    const {forecast, upgrade} = this.props;
    const {max} = this.state;

    // don't allow to change value to higher if no more users are available to transit between plans
    if (value >= this.state.maxChange && value > this.state.value) {
      value = this.state.maxChange;
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

  _handleRemove() {
    removeUpgrade(this.props.forecast, this.props.upgrade);
  }

  render() {
    const minPercentage = 0;
    const maxPercentage = this.state.max;

    const percentFormatter = (value) => {
      return value.toFixed(2) + ' %';
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
            step={0.0001}
            tipFormatter={percentFormatter}
            defaultValue={this.props.upgrade.value}
            value={this.state.value}
            onChange={_.throttle(this._handleOnChange.bind(this), 600)}
            onAfterChange={this._handleOnChange.bind(this)}
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
        <div className="upgrade-slider__action">
          <a onClick={this._handleRemove.bind(this)} className="upgrade-slider__action__remove">
            <i className="fa fa-times" />
          </a>
        </div>
      </div>
    );
  }
}
