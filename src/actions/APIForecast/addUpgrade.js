import Upgrade from 'models/Upgrade';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiForecast, props) => {
  const {fromPlan, toPlan, value, date} = props;

  dispatch('AddUpgrade', {
    apiForecast,
    upgrade: Upgrade.create({
      fromPlanId: fromPlan.id,
      toPlanId: toPlan.id,
      value,
      date
    })
  });
};
