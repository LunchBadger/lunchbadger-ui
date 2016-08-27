const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (metric) => {
  dispatch('RemoveMetric', {
    metric
  });
}
