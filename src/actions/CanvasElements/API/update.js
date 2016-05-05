const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (id, props) => {
  dispatch('UpdateAPI', {
    id: id,
    data: {...props}
  });
};
