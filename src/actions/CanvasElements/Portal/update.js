const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id, props) => {
  dispatch('UpdatePortal', {
    id: id,
    data: {...props}
  });
};
