const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (api, endpoint) => {
  dispatch('UnbundleAPI', {
    api,
    endpoint
  });
};
