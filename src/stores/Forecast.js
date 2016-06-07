import _ from 'lodash';
import moment from 'moment';
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
        case 'AddDowngrade':
          this.addUpgradeToApi(action.apiForecast, action.upgrade);
          this.emitChange();
          break;
        case 'CreateForecast':
          this.createForecastForEachPlanInApi(action.forecast, action.details, action.tierDetails);
          this.emitChange();
          break;
        case 'UpgradePlan':
          this.changeUpgradeValue(action.apiForecast, action.data.fromPlanId, action.data.toPlanId, action.data.value, action.data.date);
          this.recalculateNextForecastsBase(action.apiForecast, action.data.date);
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
   * @param forecast {APIForecast}
   * @param upgrade {Upgrade}
   */
  addUpgradeToApi(forecast, upgrade) {
    forecast.api.addUpgrade(upgrade);
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

  changeUpgradeValue(forecast, fromPlanId, toPlanId, value, date) {
    const {api} = forecast;
    const fromPlan = api.findPlan({id: fromPlanId});
    const toPlan = api.findPlan({id: toPlanId});

    api.updateUpgrade({fromPlanId: fromPlanId, toPlanId: toPlanId, date: date}, {value: value});

    if (fromPlanId === null) {
      toPlan.findDetail({date: date}).changed = true;
    } else if (toPlanId === null) {
      fromPlan.findDetail({date: date}).changed = true;
    } else {
      fromPlan.findDetail({date: date}).changed = true;
      toPlan.findDetail({date: date}).changed = true;
    }
  }

  recalculateNextForecastsBase(forecast, fromDate) {
    const {api} = forecast;
    const scaleFactor = 1.01;

    api.plans.forEach((plan) => {
      const details = plan.findFutureDetails(fromDate);

      details.forEach((detail) => {
        const prevMonth = moment(detail.date, 'M/YYYY').subtract(1, 'months').format('M/YYYY');

        detail.subscribers.forecast(plan.getUsersCountAtDateIncludingUpgrades(prevMonth, api), scaleFactor);
      });
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
