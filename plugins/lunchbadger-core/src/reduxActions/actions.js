import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator(
  [
    'loadProject',
    'saveProject',
  ],
  [
    'removeEntity',
    'setState',
    'setStates',
    'onLoadProject',
    'changePanelStatus',

    'addSystemDefcon1',
    'toggleSystemDefcon1',

    'setLoadingProject',

    'setPortDOMElement',

    'clearProject',

    'updateOrder',

    'addInitialConnections',
  ],
);

export {
  actions,
  actionTypes,
};
