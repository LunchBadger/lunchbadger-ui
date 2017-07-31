import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator(
  [
    'loadProject',
    'saveProject',
  ],
  [
    'removeEntity',
    'setStates',
    'onLoadProject',
    'addSystemDefcon1',
    'toggleSystemDefcon1',
  ],
);

export {
  actions,
  actionTypes,
};
