const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (api, endpoint) => {
  dispatch('BundleAPI', {
    api,
    endpoint
  });
};
