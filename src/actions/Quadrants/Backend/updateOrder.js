import {dispatch} from 'dispatcher/AppDispatcher';

export default (entity, itemOrder, hoverOrder) => {
  dispatch('UpdateBackendOrder', {
    entity,
    itemOrder,
    hoverOrder
  });
};
