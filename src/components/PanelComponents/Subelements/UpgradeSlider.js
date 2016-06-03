import React, {Component, PropTypes} from 'react';
import './UpgradeSlider.scss';
import Slider from 'rc-slider';
import upgradePlan from 'actions/APIForecast/upgradePlan';
import numeral from 'numeral';
import _ from 'lodash';
import moment from 'moment';

export default class UpgradeSlider extends Component {
  static propTypes = {
    forecast: PropTypes.object.isRequired,
    upgrade: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      movedUsers: 0,
      max: 10
    }
  }

  componentWillMount() {
    const {forecast, upgrade} = this.props;

    this.fromPlan = forecast.api.findPlan({id: upgrade.fromPlanId});
    this.toPlan = forecast.api.findPlan({id: upgrade.toPlanId});
    this._recalculateUsers(upgrade.value);
    this.setState({max: Math.ceil((upgrade.value || 1) / 10) * 10});
  }

  _recalculateUsers(value) {
    const planDetails = this.fromPlan.findDetail({date: this.props.upgrade.date});
    this.setState({movedUsers: Math.round(planDetails.subscribers.sum * (value / 100))});
  }

  _handleOnChange(value) {
    const {forecast, upgrade} = this.props;
    const {max} = this.state;

    this._recalculateUsers(value);

    upgradePlan(forecast, {
      fromPlanId: upgrade.fromPlanId,
      toPlanId: upgrade.toPlanId,
      date: upgrade.date,
      value: value
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
          </div>
          <div className="upgrade-slider__legend__name">
            {this.fromPlan.name}
            {' '}
            {
              this.props.upgrade.downgrade ? 'downgrade to' : 'upgrade to'
            }
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
