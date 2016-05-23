import _ from 'lodash';

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
          // TODO: add plan to api copy
          //this.addPlanToApi(action.apiForecast, APIPlan.create(action.data));
          this.emitChange();
          break;
        case 'AddTier':
          // TODO: add tier to api copy play
          //this.addTierToPlan(action.apiPlan, Tier.create(action.data));
          this.emitChange();
          break;
        case 'AddUpgrade':
          // TODO: add upgrade to api forecast
          //this.addUpgradeToApi(action.apiForecast, Upgrade.create(action.data));
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
    apiForecast.addPlan(plan);
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


}

export default new Forecast;
