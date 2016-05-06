const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (from, to, info) => {
  dispatch('AddConnection', {
    from,
    to,
    info
  });
};
