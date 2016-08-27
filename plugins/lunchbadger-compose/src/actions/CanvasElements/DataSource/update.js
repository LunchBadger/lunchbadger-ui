const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id, props) => {
  dispatch('UpdateDataSource', {
    id: id,
    data: {...props}
  });
};
