import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator([
  'loadProject',
  'saveProject',
]);

export {
  actions,
  actionTypes,
};
