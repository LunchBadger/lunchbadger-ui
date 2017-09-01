import _ from 'lodash';
import moment from 'moment';
import APIForecast from '../models/APIForecast';
import ForecastAPI from '../models/ForecastAPI';
import APIPlan from '../models/ForecastAPIPlan';
import Upgrade from '../models/Upgrade';
import ForecastTier from '../models/ForecastTier';
import {actions} from './actions';

const {PlanParameters, PlanSubscribers, PlanDetails, TierDetails} = LunchBadgerMonetize.models;
const {actions: coreActions} = LunchBadgerCore.utils;
const dateFormat = 'M/YYYY';

export const addAPIForecast = (api, left, top) => dispatch => {
  const forecastAPI = ForecastAPI.create(api.toJSON());
  dispatch(actions.updateForecast(
    APIForecast.create({
      id: forecastAPI.id,
      api: forecastAPI,
      left: left || 0,
      top: top || 0,
    }),
  ));
};

export const updateAPIForecast = (id, props) => (dispatch, getState) => {
  const {forecasts} = getState().entities;
  if (forecasts[id]) {
    const updatedForecast = forecasts[id].recreate();
    updatedForecast.update(props);
    dispatch(actions.updateForecast(updatedForecast));
  }
};

export const removeAPIForecast = id => dispatch => dispatch(actions.removeForecast({id}));

export const setForecast = (forecast, date, expanded = null) => (dispatch, getState) => {
  let selectedDate;
  if (date instanceof Date) {
    selectedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
  } else {
    selectedDate = date;
  }
  const state = getState();
  const data = state.states.currentForecast || {};
  const userData = {
    forecast,
    selectedDate,
  };
  if (expanded !== null) {
    userData['expanded'] = expanded;
  }
  const forecastData = Object.assign({}, data, userData);
  dispatch(coreActions.setStates([
    {key: 'currentForecast', value: forecastData},
    {key: 'currentForecastInformation', value: {
      id: forecastData.forecast.id,
      expanded: forecastData.expanded || false,
      selectedDate: forecastData.selectedDate,
    }},
  ]));
  dispatch(actions.updateForecast(forecast.recreate()));
};

export const createForecast = (entity, date) => (dispatch) => {
  const prevMonth = date.clone().subtract(1, 'months');
  const newDetails = {};
  const newTierDetails = {};
  if (entity.api.isForecastCreated(date.format(dateFormat))) return;
  const forecast = entity.recreate();
  forecast.api.plans.forEach((plan) => {
    let details;
    let tiers = {};
    const prevPlanDetails = _.filter(plan.details, (details) => {
      return details.date === prevMonth.format(dateFormat);
    });
    _.forEach(plan.tiers, (tier) => {
      const prevTierDetails = _.filter(tier.details, (details) => {
        return details.date === prevMonth.format(dateFormat);
      });
      let details;
      if (prevTierDetails.length) {
        details = TierDetails.create({
          ...prevTierDetails[0].toJSON()
        });
      } else {
        details = TierDetails.create({});
      }
      details.date = date.format(dateFormat);
      tiers[tier.id] = details;
    });
    newTierDetails[plan.id] = tiers;
    if (prevPlanDetails.length) {
      details = PlanDetails.create({
        ...prevPlanDetails[0].toJSON()
      });
    } else {
      details = PlanDetails.create({});
    }
    details.date = date.format(dateFormat);
    details.changed = false;
    // add percentage values to each detail
    let scaleFactor = 1;
    if (prevMonth.isAfter(moment(), 'month')) {
      // 1% more if previous plan was forecast plan
      scaleFactor = 1.01;
    }
    details.subscribers.forecast(plan.getUsersCountAtDateIncludingUpgrades(prevMonth.format(dateFormat), forecast.api), scaleFactor);
    newDetails[plan.id] = details;
  });
  forecast.api.plans.forEach((plan) => {
    if (newDetails[plan.id]) {
      plan.addPlanDetails(newDetails[plan.id]);
    }
    if (newTierDetails[plan.id]) {
      plan.tiers.forEach((tier) => {
        const tierDetails = newTierDetails[plan.id][tier.id];
        if (tierDetails) {
          tier.addTierDetails(tierDetails);
        }
      });
    }
  });
  dispatch(actions.updateForecast(forecast));
};

export const addPlan = (forecast, props, date) => (dispatch) => {
  const apiForecast = forecast.recreate();
  const plan = APIPlan.create({new: true, ...props});
  const planDetails = PlanDetails.create({
    date,
    parameters: PlanParameters.create({
      callsPerSubscriber: 0,
      cashPerCall: 0,
    }),
    subscribers: PlanSubscribers.create({
      existing: 0,
      new: 0,
      upgrades: 0,
      downgrades: 0,
      churn: 0,
    }),
  });
  plan.addPlanDetails(planDetails);
  apiForecast.api.addPlan(plan);
  dispatch(actions.updateForecast(forecast));
};

export const updatePlan = (forecast, plan, planName) => (dispatch) => {
  const updatedForecast = forecast.recreate();
  const planToUpdate = updatedForecast.api.findPlan({id: plan.id});
  if (planToUpdate) {
    planToUpdate.name = planName;
    planToUpdate.new = false;
    dispatch(actions.updateForecast(updatedForecast));
  }
};

export const addUpgrade = (forecast, props) => (dispatch) => {
  const {fromPlan, toPlan, value, date} = props;
  const updatedForecast = forecast.recreate();
  const upgrade = Upgrade.create({
    fromPlanId: fromPlan ? fromPlan.id : null,
    toPlanId: toPlan ? toPlan.id : null,
    value,
    date,
    downgrade: false,
  });
  updatedForecast.api.addUpgrade(upgrade);
  dispatch(actions.updateForecast(updatedForecast));
};

export const addDowngrade = (forecast, props) => (dispatch) => {
  const {fromPlan, toPlan, value, date} = props;
  const updatedForecast = forecast.recreate();
  const upgrade = Upgrade.create({
    fromPlanId: fromPlan ? fromPlan.id : null,
    toPlanId: toPlan ? toPlan.id : null,
    value,
    date,
    downgrade: true,
  });
  updatedForecast.api.addUpgrade(upgrade);
  dispatch(actions.updateForecast(updatedForecast));
};

export const upgradePlan = (apiForecast, props) => (dispatch) => {
  const forecast = apiForecast.recreate();
  const {fromPlanId, toPlanId, value, date} = props;
  const {api} = forecast;
  const fromPlan = api.findPlan({id: fromPlanId});
  const toPlan = api.findPlan({id: toPlanId});
  api.updateUpgrade({fromPlanId, toPlanId, date}, {value});
  if (fromPlanId === null) {
    toPlan.findDetail({date}).changed = true;
  } else if (toPlanId === null) {
    fromPlan.findDetail({date}).changed = true;
  } else {
    fromPlan.findDetail({date}).changed = true;
    toPlan.findDetail({date}).changed = true;
  }
  const scaleFactor = 1.01;
  api.plans.forEach((plan) => {
    const details = plan.findFutureDetails(date);
    details.forEach((detail) => {
      const prevMonth = moment(detail.date, 'M/YYYY').subtract(1, 'months').format('M/YYYY');
      detail.subscribers.forecast(plan.getUsersCountAtDateIncludingUpgrades(prevMonth, api), scaleFactor);
    });
  });
  dispatch(actions.updateForecast(forecast));
};

export const removeUpgrade = (apiForecast, upgrade) => (dispatch) => {
  const forecast = apiForecast.recreate();
  _.remove(forecast.api.upgrades, {id: upgrade.id});
  dispatch(actions.updateForecast(forecast));
};

export const addTier = (forecastId, plan, fromDate) => (dispatch, getState) => {
  const forecast = getState().entities.forecasts[forecastId].recreate();
  const changedPlan = forecast.api.plans.find(item => item === plan);
  const tierParameters = {
    conditionFrom: 1,
    conditionTo: 5000,
    value: 0.01,
    type: 'fixed',
  };
  const tier = ForecastTier.create(tierParameters);
  changedPlan.addTier(tier);
  const details = _.filter(changedPlan.details, (detail) => {
    return moment(detail.date, 'M/YYYY').isSame(moment(fromDate, 'M/YYYY'), 'month');
  });
  details.forEach((detail) => {
    const parameters = Object.assign({}, tierParameters, {date: detail.date, new: true});
    const tierDetails = TierDetails.create(parameters);
    detail.changed = true;
    tier.addTierDetails(tierDetails);
  });
  dispatch(actions.updateForecast(forecast));
};

export const saveTier = (forecastId, plan, tier, fromDate, params) => (dispatch, getState) => {
  const forecast = getState().entities.forecasts[forecastId].recreate();
  const changedPlan = forecast.api.plans.find(item => item === plan);
  const changedTier = changedPlan.tiers.find(item => item == tier);
  const details = _.filter(changedTier.details, (detail) => {
    return moment(detail.date, 'M/YYYY').isSame(moment(fromDate, 'M/YYYY'), 'month');
  });
  details.forEach((detail) => {
    const planDetail = changedPlan.findDetail({date: detail.date});
    detail.conditionFrom = params.conditionFrom;
    detail.conditionTo = params.conditionTo;
    detail.value = parseFloat(params.value);
    detail.type = params.type;
    detail.new = false;
    if (planDetail) {
      planDetail.changed = true;
    }
  });
  dispatch(actions.updateForecast(forecast));
};

export const removeTier = (forecastId, plan, tier, fromDate) => (dispatch, getState) => {
  const forecast = getState().entities.forecasts[forecastId].recreate();
  const changedPlan = forecast.api.plans.find(item => item === plan);
  const changedTier = changedPlan.tiers.find(item => item == tier);
  const details = _.filter(changedTier.details, (detail) => {
    return moment(detail.date, 'M/YYYY').isSame(moment(fromDate, 'M/YYYY'), 'month');
  });
  details.forEach((detail) => {
    const planDetail = changedPlan.findDetail({date: detail.date});
    changedTier.removeTierDetail({date: detail.date});
    if (planDetail) {
      planDetail.changed = true;
    }
  });
  dispatch(actions.updateForecast(forecast));
};
