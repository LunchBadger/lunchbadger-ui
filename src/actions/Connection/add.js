const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (from, to, info) => {
  dispatch('AddConnection', {
    from,
    to,
    info
  });
};
