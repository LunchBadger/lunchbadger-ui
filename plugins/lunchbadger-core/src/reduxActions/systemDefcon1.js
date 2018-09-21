import {actions} from './actions';

export const addSystemDefcon1 = (error, entityId, source = 'other') => dispatch => {
  const entityError = dispatch(actions.addEntityError({error, entityId, source}));
  if (!entityError.payload.error.error.processed) {
    dispatch(actions.addSystemDefcon1({error, source}));
    return false;
  }
  return true;
};

export const toggleSystemDefcon1 = () => dispatch => dispatch(actions.toggleSystemDefcon1());

export const removeSystemDefcon1 = error => dispatch => dispatch(actions.removeSystemDefcon1(error));

export const clearSystemDefcon1 = () => dispatch => dispatch(actions.clearSystemDefcon1());
