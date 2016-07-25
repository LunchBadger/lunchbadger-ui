const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (fromPortal, toPortal, api) => {
  dispatch('RebundlePortal', {
    fromPortal,
    toPortal,
    api
  });
};
