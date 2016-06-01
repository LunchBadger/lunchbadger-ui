import React, {PropTypes, Component} from 'react';
import BasePlan from './BasePlan';
import UpgradeSlider from './UpgradeSlider';
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

  _setCurrentPlan(planId) {
    if (this.state.currentPlan === planId) {
      this.setState({
        currentPlan: null
      });
    } else {
      this.setState({
        currentPlan: planId
      });
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
                    parent={this.props.entity}
                    date={this.props.selectedDate}
                    entity={plan}
                    setCurrent={() => this._setCurrentPlan(plan.id)}
                    currentPlan={this.state.currentPlan === plan.id}/>
          <span className="forecast-plans__plan__users">
            {numeral(plan.getUsersCountAtDate(this.props.selectedDate)).format('0,0')} users
          </span>
        </div>
      );
    });
  }

  renderUpgrades() {
    return this.props.entity.upgrades.map((upgrade, index) => {
      return (
        <li key={`upgrade_${index}`}>
          <UpgradeSlider key={upgrade.id}
                         value={upgrade.value}
                         date={this.props.selectedDate}
                         forecast={this.props.entity}
                         toPlan={upgrade.toPlan}
                         fromPlan={upgrade.fromPlan}/>
        </li>
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

        <ul className="api-forecast__upgrade-sliders">
          {this.renderUpgrades()}
        </ul>
      </div>
    );
  }
}
