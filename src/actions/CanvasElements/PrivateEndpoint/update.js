const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id, props) => {
  dispatch('UpdatePrivateEndpoint', {
    id: id,
    data: {...props}
  });
};
