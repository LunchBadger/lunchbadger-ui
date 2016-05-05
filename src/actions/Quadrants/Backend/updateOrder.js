const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (entity, itemOrder, hoverOrder) => {
  dispatch('UpdateBackendOrder', {
    entity,
    itemOrder,
    hoverOrder
  });
};
