const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (entity, itemOrder, hoverOrder) => {
  dispatch('UpdatePublicOrder', {
    entity,
    itemOrder,
    hoverOrder
  });
};
