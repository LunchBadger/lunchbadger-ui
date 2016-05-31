import React, {Component, PropTypes} from 'react';
import './UpgradeSlider.scss';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import UpgradePlan from 'actions/APIForecast/upgradePlan';
import _ from 'lodash';


export default class UpgradeSlider extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    toPlan: PropTypes.object.isRequired,
    fromPlan: PropTypes.object.isRequired,
    value: PropTypes.number.isRequired,
    forecast: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  findPlanDetailsByDate(planDetails, date) {
    return _.find(planDetails, function (details) {
      return details.date === date;
    });
  }

  _handleOnChange(e) {
    UpgradePlan(this.props.forecast, {
      toPlan: this.findPlanDetailsByDate(this.props.toPlan.details, this.props.date),
      fromPlan: this.findPlanDetailsByDate(this.props.fromPlan.details, this.props.date),
      value: e
    });
  }

  render() {

    return (
      <div className="upgrade-slider">
        <div className="upgrade-slider__legend">
          <span  className="upgrade-slider__value">{this.props.fromPlan.name}</span>
          <span  className="upgrade-slider__value">{this.props.toPlan.name}</span>
        </div>
        <div className="upgrade-slider__slider">
          <Slider
            defaultValue={this.props.value}
            onChange={this._handleOnChange.bind(this)}
            min={0}
            max={100}/>
        </div>
      </div>
    )
  }
}
