const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (model, attrs) => {
  dispatch('AddModelProperty', {
    model,
    attrs
  });
};
