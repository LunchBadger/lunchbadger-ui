const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiForecast, props, date) => {
  dispatch('AddPlan', {
    apiForecast,
    data: {
      new: true,
      ...props
    },
    date
  });
};
