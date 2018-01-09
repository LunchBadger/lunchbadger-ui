import {actions} from './actions';

export const addSystemDefcon1 = error => dispatch => dispatch(actions.addSystemDefcon1(error));

export const toggleSystemDefcon1 = () => dispatch => dispatch(actions.toggleSystemDefcon1());

export const removeSystemDefcon1 = error => dispatch => dispatch(actions.removeSystemDefcon1(error));

export const clearSystemDefcon1 = () => (dispatch, getState) => {
  if (getState().systemDefcon1.errors.length > 0) {
    dispatch(actions.clearSystemDefcon1());
  }
}
