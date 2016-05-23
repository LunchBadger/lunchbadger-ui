const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiForecast, props) => {
  dispatch('AddUpgrade', {
    apiForecast,
    data: {...props}
  });
};
