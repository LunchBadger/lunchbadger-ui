import _ from 'lodash';
import moment from 'moment';
import ForecastTier from 'models/ForecastTier';
import APIPlan from 'models/ForecastAPIPlan';

const {AppState, BaseStore} = LunchBadgerCore.stores;
const {register} = LunchBadgerCore.dispatcher.AppDispatcher;
const TierDetails = LunchBadgerMonetize.models.TierDetails;
const {PlanParameters, PlanSubscribers, PlanDetails} = LunchBadgerMonetize.models;
let Forecasts = [];

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

          if (AppState.getStateKey('currentForecast') && AppState.getStateKey('currentForecast').forecast.id === action.id) {
            AppState.setStateKey('currentForecast', null);
          }

          this.emitChange();
          break;
        case 'AddPlan':
          const plan = APIPlan.create(action.data);

          const planDetails = PlanDetails.create({
            date: action.date,
            parameters: PlanParameters.create({
              callsPerSubscriber: 0,
              cashPerCall: 0
            }),
            subscribers: PlanSubscribers.create({
              existing: 0,
              new: 0,
              upgrades: 0,
              downgrades: 0,
              churn: 0
            })
          });

          plan.addPlanDetails(planDetails);

          this.addPlanToApi(action.apiForecast, plan);
          this.emitChange();
          break;
        case 'AddTier':
          this.addTierToPlan(action.plan, action.fromDate);
          this.emitChange();
          break;
        case 'RemoveTier':
          this.removeTierFromPlan(action.plan, action.tier, action.fromDate);
          this.emitChange();
          break;
        case 'SaveTier':
          this.updateTierDetails(action.plan, action.tier, action.fromDate, action.params);
          this.emitChange();
          break;
        case 'AddUpgrade':
        case 'AddDowngrade':
          this.addUpgradeToApi(action.apiForecast, action.upgrade);
          this.emitChange();
          break;
        case 'RemoveUpgrade':
          _.remove(action.forecast.api.upgrades, {id: action.upgrade.id});
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
        case 'InitializeAPIForecast':
          this.addApiForecast(action.forecast);
          this.emitChange();
          this.emitInit();
          break;
        case 'UpdatePlan':
          const planToUpdate = action.forecast.api.findPlan({id: action.plan.id});

          if (planToUpdate) {
            planToUpdate.name = action.planName;
            planToUpdate.new = false;

            this.emitChange();
          }

          break;
      }
    });
  }

  empty() {
    Forecasts = [];
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

    return _.find(Forecasts, (forecast) => {
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
   * @param plan {ForecastAPIPlan}
   * @param fromDate {String} - date in format 'M/YYYY'
   */
  addTierToPlan(plan, fromDate) {
    const tierParameters = {
      conditionFrom: 1,
      conditionTo: 5000,
      value: 0.01,
      type: 'fixed'
    };

    const tier = ForecastTier.create(tierParameters);

    plan.addTier(tier);

    const details = _.filter(plan.details, (detail) => {
      return moment(detail.date, 'M/YYYY').isSame(moment(fromDate, 'M/YYYY'), 'month');
    });

    details.forEach((detail) => {
      const parameters = Object.assign({}, tierParameters, {date: detail.date, new: true});
      const tierDetails = TierDetails.create(parameters);
      detail.changed = true;
      tier.addTierDetails(tierDetails);
    });
  }

  /**
   * @param plan {ForecastAPIPlan}
   * @param tier {ForecastTier}
   * @param fromDate {String} - date in format 'M/YYYY'
   */
  removeTierFromPlan(plan, tier, fromDate) {
    const details = _.filter(tier.details, (detail) => {
      return moment(detail.date, 'M/YYYY').isSame(moment(fromDate, 'M/YYYY'), 'month');
    });

    details.forEach((detail) => {
      const planDetail = plan.findDetail({date: detail.date});
      tier.removeTierDetail({date: detail.date});

      if (planDetail) {
        planDetail.changed = true;
      }
    });
  }

  updateTierDetails(plan, tier, fromDate, params) {
    const details = _.filter(tier.details, (detail) => {
      return moment(detail.date, 'M/YYYY').isSame(moment(fromDate, 'M/YYYY'), 'month');
    });

    details.forEach((detail) => {
      const planDetail = plan.findDetail({date: detail.date});

      detail.conditionFrom = params.conditionFrom;
      detail.conditionTo = params.conditionTo;
      detail.value = parseFloat(params.value);
      detail.type = params.type;

      detail.new = false;

      if (planDetail) {
        planDetail.changed = true;
      }
    });
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
