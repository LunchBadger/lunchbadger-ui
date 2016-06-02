import React, {Component, PropTypes} from 'react';
import './UpgradeSlider.scss';
import Slider from 'rc-slider';
import UpgradePlan from 'actions/APIForecast/upgradePlan';
import numeral from 'numeral';

export default class UpgradeSlider extends Component {
  static propTypes = {
    date: PropTypes.string.isRequired,
    toPlanId: PropTypes.string.isRequired,
    fromPlanId: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
    forecast: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      movedUsers: 0
    }
  }

  componentWillMount() {
    const {forecast, fromPlanId, toPlanId} = this.props;

    this.fromPlan = forecast.api.findPlan({id: fromPlanId});
    this.toPlan = forecast.api.findPlan({id: toPlanId});
  }

  _handleOnChange(value) {
    const planDetails = this.fromPlan.findDetail({date: this.props.date});
    this.setState({movedUsers: Math.round(planDetails.subscribers.sum * (value / 100))});
    // UpgradePlan(this.props.forecast, {
    //   toPlan: this.findPlanDetailsByDate(this.props.toPlan.details, this.props.date),
    //   fromPlan: this.findPlanDetailsByDate(this.props.fromPlan.details, this.props.date),
    //   value: e
    // });
  }

  render() {
    const minPercentage = 0;
    const maxPercentage = 10;

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
            {' '} moved to {' '}
            {this.toPlan.name}
          </div>
        </div>
        <div className="upgrade-slider__slider">
          <Slider
            step={0.01}
            tipFormatter={percentFormatter}
            defaultValue={this.props.value}
            onChange={this._handleOnChange.bind(this)}
            min={minPercentage}
            max={maxPercentage}/>
        </div>
      </div>
    );
  }
}
