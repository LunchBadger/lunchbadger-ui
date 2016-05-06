const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (fromAPI, toAPI, endpoint) => {
  dispatch('RebundleAPI', {
    fromAPI,
    toAPI,
    endpoint
  });
};
