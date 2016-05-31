import _ from 'lodash';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const PlanDetails = LunchBadgerMonetize.models.PlanDetails;
const TierDetails = LunchBadgerMonetize.models.TierDetails;

const dateFormat = 'M/YYYY';

export default (forecast, date) => {
  const prevMonth = date.clone().subtract(1, 'months');
  const newDetails = {};
  const newTierDetails = {};

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

    // add percentage values to each detail
    const scaleFactor = 1.05;

    details.parameters.upgrade(scaleFactor);
    details.subscribers.upgrade(scaleFactor);

    newDetails[plan.id] = details;
  });

  dispatch('CreateForecast', {
    forecast: forecast,
    details: newDetails,
    tierDetails: newTierDetails
  });
};
