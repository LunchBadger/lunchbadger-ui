const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (entity, itemOrder, hoverOrder) => {
  dispatch('UpdatePrivateOrder', {
    entity,
    itemOrder,
    hoverOrder
  });
};
