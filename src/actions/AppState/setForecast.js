const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

/**
 * @param forecast
 * @param date {Date}
 */
export default (forecast, date) => {
  dispatch('SetForecast', {
    forecastData: {
      forecast: forecast,
      selectedDate: `${date.getMonth() + 1}/${date.getFullYear()}`
    }
  });
};
