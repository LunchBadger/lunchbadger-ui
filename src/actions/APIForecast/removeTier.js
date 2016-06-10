const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (tier, date) => {
  dispatch('RemoveTier', {
    tier,
    fromDate: date
  });
}
