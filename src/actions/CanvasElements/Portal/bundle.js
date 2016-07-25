const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (portal, api) => {
  dispatch('BundlePortal', {
    portal,
    api
  });
};
