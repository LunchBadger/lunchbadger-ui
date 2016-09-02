const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (forecast, plan, planName) => {
  dispatch('UpdatePlan', {
    forecast,
    plan,
    planName
  });
}
