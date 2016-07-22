const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id, props) => {
  setTimeout(() => {
    dispatch('UpdateGateway', {
      id: id,
      data: {ready: true, ...props}
    });
  }, 1500);

  dispatch('UpdateGateway', {
    id: id,
    data: {ready: false, ...props}
  });
};
