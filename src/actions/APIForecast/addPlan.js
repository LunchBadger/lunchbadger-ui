const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiForecast, props) => {
  dispatch('AddPlan', {
    apiForecast,
    data: {...props}
  });
};
