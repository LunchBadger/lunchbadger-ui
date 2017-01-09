const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (id, props) => {
  dispatch('UpdateMicroservice', {
    id: id,
    data: {...props}
  });
};
