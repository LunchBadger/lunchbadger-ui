const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiForecast, props) => {
  dispatch('UpgradePlan', {
    apiForecast,
    data: {...props}
  });
};
