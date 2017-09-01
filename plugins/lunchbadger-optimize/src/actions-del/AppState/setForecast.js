// const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
// const {AppState} = LunchBadgerCore.stores;
//
// /**
//  * @param forecast
//  * @param date {Date|String}
//  * @param expanded {Boolean}
//  */
// export default (forecast, date, expanded = null) => {
//   let selectedDate;
//
//   if (date instanceof Date) {
//     selectedDate = `${date.getMonth() + 1}/${date.getFullYear()}`;
//   } else {
//     selectedDate = date;
//   }
//
//   const data = AppState.getStateKey('currentForecast') || {};
//
//   const userData = {
//     forecast: forecast,
//     selectedDate: selectedDate
//   };
//
//   if (expanded !== null) {
//     userData['expanded'] = expanded;
//   }
//
//   const forecastData = Object.assign({}, data, userData);
//
//   dispatch('SetForecast', {
//     forecastData
//   });
// };
