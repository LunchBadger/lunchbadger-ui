const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id) => {
  dispatch('RemoveAPIForecast', {
    id: id,
  });
};
