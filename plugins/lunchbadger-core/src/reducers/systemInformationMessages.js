import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.addSystemInformationMessage:
      const newStateAdd = [...state];
      const validUntil = Date.now() + 5000;
      if (state.filter(item => item.message === action.payload).length > 0) {
        newStateAdd.forEach((item, idx) => {
          if (item.message === action.payload) {
            newStateAdd[idx].validUntil = validUntil;
          }
        });
        return newStateAdd;
      }
      return [
        {
          ...action.payload,
          validUntil,
        },
        ...state,
      ];
    case actionTypes.removeSystemInformationMessages:
      const newStateRemove = [];
      state.forEach((item) => {
        if (!action.payload.includes(item.message)) {
          newStateRemove.push(item);
        }
      });
      return newStateRemove;
    default:
      return state;
  }
};
