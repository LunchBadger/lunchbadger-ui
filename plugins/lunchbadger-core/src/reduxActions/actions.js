import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator(
  [
    'loadProject',
    'saveProject',
  ],
  [
    'removeEntity',
  ],
);

export {
  actions,
  actionTypes,
};
