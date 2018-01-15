import {actions} from './actions';

export const setEntitiesStatus = entitiesStatus => (dispatch, getState) => {
  const {onEntityStatusChange} = getState().plugins;
  Object.keys(entitiesStatus).map(key => dispatch(onEntityStatusChange[key](entitiesStatus[key])));
  dispatch(actions.setEntitiesStatus(entitiesStatus));
};
