import React, {Component} from 'react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';
import classNames from 'classnames';
import BasePlan from './BasePlan';
import UpgradeSlider from './UpgradeSlider';
import UserPoolSlider from './UserPoolSlider';
import ForecastPlanDetails from './ForecastPlanDetails';
import PlanInstructions from './PlanInstructions';
import UserPool from './UserPool';
import {addPlan} from '../../../reduxActions/forecasts';
import ForecastPlanInput from './ForecastPlanInput';
import './ForecastPlans.scss';

export default class ForecastPlans extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    selectedDate: PropTypes.string.isRequired,
    handleUpgradeCreation: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentPlan: null
    };
  }

  _setCurrentPlan(plan) {
    if (this.state.currentPlan && this.state.currentPlan.id === plan.id) {
      this._handlePlanClose();
    } else {
      this._handlePlanOpen(plan);
    }
  }

  _handleAddPlan = () => {
    const {entity, selectedDate} = this.props;
    this.context.store.dispatch(addPlan(entity, {name: 'Enterprise', icon: 'fa-space-shuttle'}, selectedDate));
  }

  _handlePlanOpen(plan) {
    this.setState({currentPlan: plan});
  }

  _handlePlanClose() {
    this.setState({currentPlan: null});
  }

  renderPlans() {
    const {entity, selectedDate} = this.props;
    const planClass = classNames({
      'forecast-plans__plan': true,
      'forecast-plans__plan--expanded': this.state.currentPlan
    });
    return entity.api.plans.map((plan, index) => {
      const planDetail = plan.findDetail({date: selectedDate});
      let userCount = 0;
      if (planDetail) {
        userCount = planDetail.subscribers.sum;
      }
      return (
        <div className={planClass} key={`plan_${index}`}>
          {plan.new && (
            <ForecastPlanInput
              className="forecast-plans__plan__input"
              plan={plan}
              forecast={entity}
              value={plan.name}
            />
          )}
          {!plan.new && (
            <div className="forecast-plans__plan__name-holder">
              <div className="forecast-plans__plan__name">
                {plan.name}
              </div>
              <div className="forecast-plans__plan__name-tooltip">
                {plan.name}
              </div>
            </div>
          )}
          <BasePlan
            key={plan.id}
            index={index}
            forecast={entity}
            date={selectedDate}
            plan={plan}
            handleUpgradeCreation={this.props.handleUpgradeCreation.bind(this)}
            isCurrent={this.state.currentPlan && this.state.currentPlan.id === plan.id}
            handleClick={() => this._setCurrentPlan(plan)}
          />
          <span className="forecast-plans__plan__users">
            {numeral(userCount).format('0,0')} users
          </span>
        </div>
      );
    });
  }

  renderUpgrades(upgrades) {
    return upgrades.map((upgrade) => {
      if (upgrade.fromPlanId === null || upgrade.toPlanId === null) {
        return (
          <UserPoolSlider
            key={upgrade.id}
            upgrade={upgrade}
            upgrades={upgrades}
            forecast={this.props.entity}
          />
        );
      }
      return (
        <UpgradeSlider
          key={upgrade.id}
          upgrades={upgrades}
          upgrade={upgrade}
          forecast={this.props.entity}
        />
      );
    });
  }

  render() {
    const {entity, selectedDate} = this.props;
    const upgrades = entity.api.getUpgradesForDate(this.props.selectedDate);
    const date = moment(selectedDate, 'M/YYYY');
    return (
      <div className="forecast-plans">
        {date.isAfter(moment(), 'month') && (
          <div className="forecast-plans__pool">
            <UserPool forecast={entity} date={selectedDate}/>
          </div>
        )}
        <div className="forecast-plans__list">
          {this.renderPlans()}
        </div>
        {date.isAfter(moment(), 'month') && (
          <div className="forecast-plans__action">
            <a className="forecast-plans__action__add" onClick={this._handleAddPlan}>
              <i className="icon-icon-plus"/>
            </a>
          </div>
        )}
        <div className="forecast-plans__details">
          <ForecastPlanDetails
            date={selectedDate}
            plan={this.state.currentPlan}
            forecastId={entity.id}
          />
        </div>
        {upgrades.length > 0 && (
          <div className="forecast-plans__upgrades">
            {this.renderUpgrades(upgrades)}
          </div>
        )}
        {upgrades.length === 0 && date.isAfter(moment(), 'month') && (
          <div className="forecast-plans__instructions">
            <PlanInstructions />
          </div>
        )}
      </div>
    );
  }
}
