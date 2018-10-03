import actionsCreator from '../utils/actionsCreator';

const {actions, actionTypes} = actionsCreator(
  [],
  [
    'removeEntity',
    'setState',
    'setStates',
    'onLoadProject',
    'changePanelStatus',
    'setEntitiesStatuses',
    'toggleLockEntity',

    'silentEntityUpdate',
    'silentEntityRemove',

    'addSystemDefcon1',
    'addEntityError',
    'toggleSystemDefcon1',
    'removeSystemDefcon1',
    'clearSystemDefcon1',

    'addSystemInformationMessage',
    'removeSystemInformationMessages',

    'setLoadingProject',
    'setLoadedProject',

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
