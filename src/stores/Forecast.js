import _ from 'lodash';
import Tier from 'models/ForecastTier';
import APIPlan from 'models/ForecastAPIPlan';

const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;
const Forecasts = [];

class Forecast extends BaseStore {
  constructor() {
    super();
    register((action) => {
      switch (action.type) {
        case 'AddAPIForecast':
          this.addApiForecast(action.APIForecast);
          this.emitChange();
          break;
        case 'UpdateAPIForecast':
          this.updateEntity(action.id, action.data);
          this.emitChange();
          break;
        case 'RemoveAPIForecast':
          this.removeEntity(action.id);
          this.emitChange();
          break;
        case 'AddPlan':
          this.addPlanToApi(action.apiForecast, APIPlan.create(action.data));
          this.emitChange();
          break;
        case 'AddTier':
          this.addTierToPlan(action.apiPlan, Tier.create(action.data));
          this.emitChange();
          break;
        case 'AddUpgrade':
          this.addUpgradeToApi(action.apiForecast, action.upgrade);
          this.emitChange();
          break;
        case 'CreateForecast':
          this.createForecastForEachPlanInApi(action.forecast, action.details, action.tierDetails);
          this.emitChange();
          break;
        case 'UpgradePlan':
          this.upgradePlans(action.apiForecast, action.data.toPlan, action.data.fromPlan, action.data.value, action.data.date);
          this.emitChange();
          break;
      }
    });
  }

  getData() {
    return Forecasts;
  }

  findEntity(id) {
    id = this.formatId(id);

    return _.find(Forecasts, {id: id});
  }

  findEntityByApiId(id) {
    id = this.formatId(id);

    return Forecasts.forEach((forecast) => {
      return forecast.api.id === id;
    });
  }

  addApiForecast(apiForecast) {
    if (!this.findEntityByApiId(apiForecast.api.id)) {
      Forecasts.push(apiForecast);
    }
  }

  /**
   * @param apiForecast {APIForecast}
   * @param plan {APIPlan}
   */
  addPlanToApi(apiForecast, plan) {
    apiForecast.api.addPlan(plan);
  }

  /**
   * @param apiForecast {APIForecast}
   * @param upgrade {Upgrade}
   */
  addUpgradeToApi(apiForecast, upgrade) {
    apiForecast.api.addUpgrade(upgrade);
  }

  /**
   * @param apiPlan {APIPlan}
   * @param tier {Tier}
   */
  addTierToPlan(apiPlan, tier) {
    apiPlan.addTier(tier);
  }

  removeEntity(id) {
    _.remove(Forecasts, function (forecast) {
      return forecast.id === id;
    });
  }

  upgradePlans(forecast, fromPlan, toPlan, value) {
    forecast.api.plans.forEach((plan) => {
      const fromPlanDetails = _.find(plan.details, function (details) {
        return details.id === fromPlan.id
      });

      if (fromPlanDetails) {
        fromPlanDetails.subscribers.upgrades = value;
      }

      const toPlanDetails = _.find(plan.details, function (details) {
        return details.id === fromPlan.id
      });

      if (toPlanDetails) {
        toPlanDetails.subscribers.downgrades = value;
      }
    });
  }

  createForecastForEachPlanInApi(forecast, plansDetails, tiersDetails) {
    forecast.api.plans.forEach((plan) => {
      // update plan details
      if (plansDetails[plan.id]) {
        plan.addPlanDetails(plansDetails[plan.id]);
      }

      // update tier details for plan
      if (tiersDetails[plan.id]) {
        plan.tiers.forEach((tier) => {
          const tierDetails = tiersDetails[plan.id][tier.id];
          if (tierDetails) {
            tier.addTierDetails(tierDetails);
          }
        });
      }
    });
  }
}

export default new Forecast;
