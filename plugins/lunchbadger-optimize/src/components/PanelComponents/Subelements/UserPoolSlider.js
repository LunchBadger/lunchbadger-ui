import React, {Component} from 'react';
import PropTypes from 'prop-types';
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
      max: 10000,
      value: props.upgrade.value,
      maxChange: 0,
      scaleStep: 10000
    }
  }

  componentWillMount() {
    const {forecast, upgrade} = this.props;

    this.plan = upgrade.fromPlanId ? forecast.api.findPlan({id: upgrade.fromPlanId}) : forecast.api.findPlan({id: upgrade.toPlanId});

    this.planUsers = this.plan.findDetail({date: upgrade.date}).subscribers.sum;

    let max = 10;

    if (this.planUsers > 10000) {
      max = 10000;
    } else if (this.planUsers > 1000) {
      max = 1000;
    } else if (this.planUsers > 100) {
      max = 100;
    }

    this.setState({
      movedUsers: upgrade.value,
      maxChange: this.planUsers,
      max: max,
      scaleStep: max
    });

    this._calculateChangeLimit(this.props.upgrades);
  }

  componentWillReceiveProps(nextProps) {
    this._calculateChangeLimit(nextProps.upgrades);
  }

  _calculateChangeLimit(upgrades) {
    let maxChange = this.planUsers;

    const filteredDowngrades = _.filter(upgrades, (upgrade) => {
      return upgrade.fromPlanId === this.plan.id && upgrade.downgrade && upgrade.id !== this.props.upgrade.id && upgrade.toPlanId !== null;
    });

    const filteredUpgrades = _.filter(upgrades, (upgrade) => {
      return upgrade.fromPlanId === this.plan.id && !upgrade.downgrade && upgrade.id !== this.props.upgrade.id;
    });

    filteredDowngrades.forEach((downgrade) => {
      maxChange -= Math.round(downgrade.value / 100 * this.planUsers);
    });

    filteredUpgrades.forEach((upgrade) => {
      maxChange -= Math.round(upgrade.value / 100 * this.planUsers);
    });

    this.setState({maxChange: maxChange});
  }

  _handleOnChange = (value) => {
    const {forecast, upgrade} = this.props;
    const {max, scaleStep} = this.state;

    // don't allow to change value to higher if no more users are available to transit between plans
    if (value >= this.state.maxChange && value > this.state.value && upgrade.toPlanId === null) {
      value = this.state.maxChange;
    }

    upgradePlan(forecast, {
      fromPlanId: upgrade.fromPlanId,
      toPlanId: upgrade.toPlanId,
      date: upgrade.date,
      value: value
    });

    this.setState({
      value: value,
      movedUsers: value
    });

    if (value === max) {
      this.setState({max: max + scaleStep});
    }
  }

  _handleRemove = () => {
    removeUpgrade(this.props.forecast, this.props.upgrade);
  }

  render() {
    const minValue = 0;
    const maxValue = this.state.max;

    return (
      <div className="upgrade-slider">
        <div className="upgrade-slider__legend">
          <div className="upgarde-slider__legend__value">
            {numeral(this.state.movedUsers).format('0,0')}
            <PlanInfoTooltip forecast={this.props.forecast} plan={this.plan} date={this.props.upgrade.date}/>
          </div>
          <div className="upgrade-slider__legend__name">
            {
              !this.props.upgrade.downgrade && (
                <span>
                  New users in {this.plan.name}
                </span>
              )
            }

            {
              this.props.upgrade.downgrade && (
                <span>
                  Churn users in {this.plan.name}
                </span>
              )
            }
          </div>
        </div>
        <div className="upgrade-slider__slider">
          <Slider
            disabled={moment(this.props.upgrade.date, 'M/YYYY').isSameOrBefore(moment(), 'month')}
            step={1}
            defaultValue={this.props.upgrade.value}
            value={this.state.value}
            onChange={_.throttle(this._handleOnChange, 600)}
            onAfterChange={this._handleOnChange}
            min={minValue}
            max={maxValue}/>
          <div className="upgrade-slider__slider-legend">
            <div className="upgrade-slider__slider-legend__value upgrade-slider__slider-legend__value--left">
              {minValue}
            </div>
            <div className="upgrade-slider__slider-legend__value upgrade-slider__slider-legend__value--right">
              {maxValue}
            </div>
          </div>
        </div>
        <div className="upgrade-slider__action">
          <a onClick={this._handleRemove} className="upgrade-slider__action__remove">
            <i className="fa fa-times" />
          </a>
        </div>
      </div>
    );
  }
}
