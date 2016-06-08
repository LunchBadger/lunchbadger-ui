const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

/**
 * @param forecast
 * @param date {Date|String}
 */
export default (forecast, date) => {
  let selectedDate;

  if (date instanceof Date) {
    selectedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
  } else {
    selectedDate = date;
  }

  dispatch('SetForecast', {
    forecastData: {
      forecast: forecast,
      selectedDate: selectedDate
    }
  });
};
