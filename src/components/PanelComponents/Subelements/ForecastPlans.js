import React, {PropTypes, Component} from 'react';
import BasePlan from './BasePlan';
import UpgradeSlider from './UpgradeSlider';
import ForecastPlanDetails from './ForecastPlanDetails';
import addPlan from 'actions/APIForecast/addPlan';
import './ForecastPlans.scss';
import numeral from 'numeral';
import moment from 'moment';

export default class ForecastPlans extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    selectedDate: PropTypes.string.isRequired,
    handleUpgradeCreation: PropTypes.func.isRequired
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
    const {entity, selectedDate} = this.props;

    return entity.api.plans.map((plan, index) => {
      let userCount = plan.getUsersCountAtDateIncludingUpgrades(selectedDate, entity.api);

      return (
        <div className="forecast-plans__plan" key={`plan_${index}`}>
          <span className="forecast-plans__plan__name">{plan.name}</span>
          <BasePlan key={plan.id}
                    index={index}
                    forecast={this.props.entity}
                    date={this.props.selectedDate}
                    plan={plan}
                    handleUpgradeCreation={this.props.handleUpgradeCreation.bind(this)}
                    isCurrent={this.state.currentPlan && this.state.currentPlan.id === plan.id}
                    handleClick={() => this._setCurrentPlan(plan)}/>

          {
            !this.state.currentPlan && (
              <span className="forecast-plans__plan__users">
                {numeral(userCount).format('0,0')} users
              </span>
            )
          }
        </div>
      );
    });
  }

  renderUpgrades() {
    return this.props.entity.api.getUpgradesForDate(this.props.selectedDate).map((upgrade) => {
      return (
        <UpgradeSlider key={upgrade.id}
                       upgrade={upgrade}
                       forecast={this.props.entity}/>
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
