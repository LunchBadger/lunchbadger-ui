const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (api, endpoint) => {
  dispatch('UnbundleAPI', {
    api,
    endpoint
  });
};
