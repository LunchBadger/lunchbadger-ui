const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (apiForecast, props) => {
  dispatch('AddCreature', {
    apiForecast,
    data: {...props}
  });
};
