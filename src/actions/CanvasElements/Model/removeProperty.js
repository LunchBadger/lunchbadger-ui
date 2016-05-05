const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (model, property) => {
  dispatch('RemoveModelProperty', {
    model,
    property
  });
};
