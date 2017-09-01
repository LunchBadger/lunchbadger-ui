// import BaseStore from './BaseStore';
// import _ from 'lodash';
//
// const state = {};
// const stateQueue = [];
// const USE_QUEUE = true;
//
// class AppState extends BaseStore {
//   constructor() {
//     super();
//     this.subscribe(() => this._registerActions);
//     if (USE_QUEUE) {
//       setInterval(() => {
//         const queueSize = stateQueue.length;
//         for (let i = 0; i < queueSize; i += 1) {
//           const [key, value] = stateQueue.shift();
//           state[key] = value;
//         }
//         if (queueSize > 0) {
//           this.emitChange();
//         }
//       }, 300);
//     }
//   }
//
//   setStateKey(key, value) {
//     if (USE_QUEUE) {
//       stateQueue.push([key, value]);
//     } else {
//       state[key] = value;
//       this.emitChange();
//     }
//   }
//
//   getStateKey(key) {
//     return state[key];
//   }
//
//   _registerActions = (action) => {
//     switch (action.type) {
//       case 'SetForecast':
//         this.setStateKey('currentForecast', action.forecastData);
//         this.setStateKey('currentForecastInformation', {
//           id: action.forecastData.forecast.id,
//           expanded: action.forecastData.expanded || false,
//           selectedDate: action.forecastData.selectedDate
//         });
//         break;
//
//       case 'InitializeAppState':
//         const {serializedState} = action;
//         if (serializedState['currentForecast']) {
//           this.setStateKey('currentForecastInformation', serializedState['currentForecast']);
//         }
//         this.emitInit();
//         break;
//     }
//   }
//
//   getData() {
//     return state;
//   }
// }
//
// export default new AppState();
