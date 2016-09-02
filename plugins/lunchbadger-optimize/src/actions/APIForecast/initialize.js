const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (forecast = null) => {
  if (forecast) {
    dispatch('InitializeAPIForecast', {
      forecast: forecast
    });
  }
}
