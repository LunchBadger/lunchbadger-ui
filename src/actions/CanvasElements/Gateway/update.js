const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id, props) => {
  dispatch('UpdateGateway', {
    id: id,
    data: {...props}
  });
};
