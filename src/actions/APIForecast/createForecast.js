import _ from 'lodash';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
const PlanDetails = LunchBadgerMonetize.models.PlanDetails;

export default (forecast, date) => {
  const prevMonth = date.clone().subtract(1, 'months');
  const newDetails = {};

  forecast.api.plans.forEach((plan) => {
    /**
     * {PlanDetails}
     */
    let details;

    const prevPlanDetails = _.filter(plan.details, (details) => {
      return details.date === prevMonth.format('M/YYYY');
    });

    if (prevPlanDetails.length) {
      details = PlanDetails.create({
        ...prevPlanDetails[0].toJSON()
      });
    } else {
      details = PlanDetails.create({});
    }

    details.date = date.format('M/YYYY');

    // add percentage values to each detail
    const scaleFactor = 1.1;

    details.parameters.upgrade(scaleFactor);
    details.subscribers.upgrade(scaleFactor);

    newDetails[plan.id] = details;
  });

  dispatch('CreateForecast', {
    forecast: forecast,
    details: newDetails
  });
};
