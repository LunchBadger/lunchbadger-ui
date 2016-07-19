const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (metric, left, top) => {
  dispatch('UpdateMetric', {
    metric,
    left,
    top
  });
}
