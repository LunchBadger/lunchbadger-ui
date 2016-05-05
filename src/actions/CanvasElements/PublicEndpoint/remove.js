const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (endpoint) => {
  dispatch('RemovePublicEndpoint', {
    endpoint: endpoint
  });
};
