import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator(
  [],
  [
    'removeEntity',
    'setState',
    'setStates',
    'onLoadProject',
    'changePanelStatus',
    'setEntitiesStatus',

    'addSystemDefcon1',
    'toggleSystemDefcon1',
    'removeSystemDefcon1',

    'addSystemInformationMessage',
    'removeSystemInformationMessages',

    'setLoadingProject',

    'setCanvasHeight',

    'clearProject',

    'updateOrder',

    'addInitialConnections',

    'multiEnvironmentsSetOnLoad',
    'multiEnvironmentsSetSelected',
    'multiEnvironmentsAdd',
    'multiEnvironmentsToggleDelta',
    'multiEnvironmentsToggleNameEdit',
    'multiEnvironmentsUpdateName',
    'multiEnvironmentsUpdateEntity',
    'multiEnvironmentsResetEntityField',
  ],
);

export {
  actions,
  actionTypes,
};
