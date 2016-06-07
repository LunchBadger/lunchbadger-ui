import _ from 'lodash';
import moment from 'moment';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const PlanDetails = LunchBadgerMonetize.models.PlanDetails;
const TierDetails = LunchBadgerMonetize.models.TierDetails;

const dateFormat = 'M/YYYY';

export default (forecast, date) => {
  const prevMonth = date.clone().subtract(1, 'months');
  const newDetails = {};
  const newTierDetails = {};

  if (forecast.api.isForecastCreated(date.format(dateFormat))) {
    return;
  }

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

  dispatch('CreateForecast', {
    forecast: forecast,
    details: newDetails,
    tierDetails: newTierDetails
  });
};
