const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (metric, pairId, type) => {
  dispatch('ChangePairType', {
    metric,
    pairId,
    pairType: type
  });
}
