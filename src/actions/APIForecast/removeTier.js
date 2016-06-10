const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (plan, tier, date) => {
  dispatch('RemoveTier', {
    plan,
    tier,
    fromDate: date
  });
}
