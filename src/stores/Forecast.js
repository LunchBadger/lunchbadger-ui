import _ from 'lodash';
import APICreature from 'models/APICreature';
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
        case 'AddCreature':
          this.addCreatureToApi(action.apiForecast, APICreature.create(action.data));
          this.emitChange();
          break;
        case 'AddTier':
          this.addTierToCreature(action.apiCreature, Tier.create(action.data));
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

  addCreatureToApi(apiForecast, creature) {
    apiForecast.addCreature(creature);
  }

  addUpgradeToApi(apiForecast, upgrade) {
    console.log(upgrade);
    apiForecast.addUpgrade(upgrade);
  }

  addTierToCreature(apiCreature, tier) {
    apiCreature.addTier(tier);
  }

  removeEntity(id) {
    _.remove(Forecasts, function (forecast) {
      return forecast.id === id;
    })
  }


}

export default new Forecast;
