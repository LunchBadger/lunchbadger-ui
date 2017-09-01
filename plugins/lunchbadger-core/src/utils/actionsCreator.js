import {createAction} from 'redux-actions';

const kinds = ['Request', 'Success', 'Failure'];

const feedWithAction = (action, actionTypes, actions) => {
  actionTypes[action] = action;
  actions[action] = createAction(action);
}

export default (payloadTypes = [], types = []) => {
  const actions = {};
  const actionTypes = {};
  payloadTypes.map(type => kinds.map(kind => feedWithAction(`${type}${kind}`, actionTypes, actions)));
  types.map(action => feedWithAction(action, actionTypes, actions));
  return {
    actions,
    actionTypes,
  };
};
