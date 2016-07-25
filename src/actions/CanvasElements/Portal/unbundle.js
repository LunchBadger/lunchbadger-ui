const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (portal, api) => {
  dispatch('UnbundlePortal', {
    portal,
    api
  });
};
