const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (endpoint) => {
  dispatch('RemovePublicEndpoint', {
    endpoint: endpoint
  });
};
