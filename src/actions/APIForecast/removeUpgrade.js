const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (forecast, upgrade) => {
  dispatch('RemoveUpgrade', {
    forecast,
    upgrade
  });
}
