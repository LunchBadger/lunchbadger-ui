import {createAction} from 'redux-actions';

export default (types) => {
  const actions = {};
  const actionTypes = {};
  types.forEach((type) => {
    ['Request', 'Success', 'Failure'].forEach((kind) => {
      const action = `${type}${kind}`;
      actionTypes[action] = action;
      actions[action] = createAction(action);
    });
  });
  return {
    actions,
    actionTypes,
  };
};
