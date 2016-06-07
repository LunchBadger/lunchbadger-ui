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
      max: 10000,
      value: props.upgrade.value
    }
  }

  componentWillMount() {
    const {forecast, upgrade} = this.props;

    this.plan = upgrade.fromPlanId ? forecast.api.findPlan({id: upgrade.fromPlanId}) : forecast.api.findPlan({id: upgrade.toPlanId});

    this.planUsers = this.plan.findDetail({date: upgrade.date}).subscribers.sum;

    this.setState({
      movedUsers: upgrade.value,
      max: Math.ceil((upgrade.value || this.state.max) / 10000) * 10000
    });
  }

  _handleOnChange(value) {
    const {forecast, upgrade} = this.props;
    const {max} = this.state;

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
      this.setState({max: max + 10000});
    }
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
            onChange={this._handleOnChange.bind(this)}
            onAfterChange={this._handleOnChange.bind(this)}
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
      </div>
    );
  }
}
