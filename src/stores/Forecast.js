import _ from 'lodash';
import Upgrade from 'models/Upgrade';


const {BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;
const Forecasts = [];
const APIPlan = LunchBadgerMonetize.models.APIPlan;
const Tier = LunchBadgerMonetize.models.Tier;

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
          // TODO: add plan to api copy
          this.addPlanToApi(action.apiForecast, APIPlan.create(action.data));
          this.emitChange();
          break;
        case 'AddTier':
          // TODO: add tier to api copy play
          this.addTierToPlan(action.apiPlan, Tier.create(action.data));
          this.emitChange();
          break;
        case 'AddUpgrade':
          // TODO: add upgrade to api forecast
          this.addUpgradeToApi(action.apiForecast, Upgrade.create(action.data));
          this.emitChange();
          break;
        case 'CreateForecast':
          this.createForecastForEachPlanInApi(action.forecast, action.details, action.tierDetails);
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
    apiForecast.addUpgrade(upgrade);
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
