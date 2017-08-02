import {actionTypes} from '../reduxActions/actions';

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.setPortDOMElement:
      return [...state, action.payload];
    default:
      return state;
  }
};
