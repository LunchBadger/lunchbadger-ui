import _ from 'lodash';
import APIPlan from 'models/APIPlan';
import Tier from 'models/Tier';
import Upgrade from 'models/Upgrade';

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
          this.addUpgradeToApi(action.apiForecast, Upgrade.create(action.data));
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

    return _.find(Forecasts, {apiId: id});
  }

  addApiForecast(apiForecast) {
    if (!this.findEntityByApiId(apiForecast.apiId)) {
      Forecasts.push(apiForecast);
    }
  }

  addPlanToApi(apiForecast, plan) {
    apiForecast.addPlan(plan);
  }

  addUpgradeToApi(apiForecast, upgrade) {
    apiForecast.addUpgrade(upgrade);
  }

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
