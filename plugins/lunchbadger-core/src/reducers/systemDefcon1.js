import {actionTypes} from '../reduxActions/actions';

const initialState = {
  errors: [],
  visible: false,
}

export default (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.addSystemDefcon1:
      const error = action.payload.error;
      const {source} = action.payload;
      if (!newState.errors.map(item => item.error).includes(error)) {
        newState.errors = [{error, source}, ...newState.errors];
        console.error(error.error);
      }
      newState.visible = true;
      return newState;
    case actionTypes.toggleSystemDefcon1:
      newState.visible = !newState.visible;
      return newState;
    case actionTypes.removeSystemDefcon1:
      newState.errors = newState.errors.filter(item => item.error.error.message !== action.payload);
      if (newState.errors.length === 0) {
        newState.visible = false;
      }
      return newState;
    case actionTypes.clearSystemDefcon1:
      newState.errors = newState.errors.filter(item => item.source !== 'workspace');
      if (newState.errors.length === 0) {
        newState.visible = false;
      }
      return newState;
    default:
      return state;
  }
};
