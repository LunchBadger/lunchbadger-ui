import React, {PropTypes, Component} from 'react';
import BasePlan from './BasePlan';
import UpgradeSlider from './UpgradeSlider';
import ForecastPlanDetails from './ForecastPlanDetails';
import addPlan from 'actions/APIForecast/addPlan';
import './ForecastPlans.scss';
import numeral from 'numeral';

export default class ForecastPlans extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    selectedDate: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      currentPlan: null
    };
  }

  _setCurrentPlan(plan) {
    if (this.state.currentPlan && this.state.currentPlan.id === plan.id) {
      this.setState({currentPlan: null});
    } else {
      this.setState({currentPlan: plan});
    }
  }

  _handleAddPlan() {
    addPlan(this.props.entity, {name: 'Super whale', icon: 'fa-space-shuttle'});
  }

  renderPlans() {
    return this.props.entity.api.plans.map((plan, index) => {
      return (
        <div className="forecast-plans__plan" key={`plan_${index}`}>
          <span className="forecast-plans__plan__name">{plan.name}</span>
          <BasePlan key={plan.id}
                    forecast={this.props.entity}
                    date={this.props.selectedDate}
                    plan={plan}
                    isCurrent={this.state.currentPlan && this.state.currentPlan.id === plan.id}
                    handleClick={() => this._setCurrentPlan(plan)}/>

          {
            !this.state.currentPlan && (
              <span className="forecast-plans__plan__users">
                {numeral(plan.getUsersCountAtDate(this.props.selectedDate)).format('0,0')} users
              </span>
            )
          }
        </div>
      );
    });
  }

  renderUpgrades() {
    return this.props.entity.api.getUpgradesForDate(this.props.selectedDate).map((upgrade, index) => {
      return (
        <UpgradeSlider key={upgrade.id}
                       value={upgrade.value}
                       date={upgrade.date}
                       forecast={this.props.entity}
                       toPlanId={upgrade.toPlanId}
                       fromPlanId={upgrade.fromPlanId}/>
      );
    });
  }

  render() {
    return (
      <div className="forecast-plans">
        <div className="forecast-plans__list">
          {this.renderPlans()}
        </div>

        <div className="forecast-plans__action">
          <a className="forecast-plans__action__add" onClick={this._handleAddPlan.bind(this)}>
            <i className="fa fa-plus"/>
          </a>
        </div>

        {
          !!this.state.currentPlan && (
            <div className="forecast-plans__details">
              <ForecastPlanDetails plan={this.state.currentPlan}/>
            </div>
          )
        }

        <div className="forecast-plans__upgrades">
          {this.renderUpgrades()}
        </div>
      </div>
    );
  }
}
