const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (model, attrs) => {
  dispatch('AddModelProperty', {
    model,
    attrs
  });
};
