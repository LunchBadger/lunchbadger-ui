import {actionTypes} from '../reduxActions/actions';

const initialState = {
  sharedProjects: [],
};

export default (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.loadSharedProjects:
      newState.sharedProjects = action.payload;
      return newState;
    default:
      return state;
  }
};
