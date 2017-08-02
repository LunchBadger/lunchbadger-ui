const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'updateAPI',
    'deleteAPI',

    'updatePortal',
    'deletePortal',
  ],
  [
    'addAPI',

    'addPortal',
  ],
);

export {
  actions,
  actionTypes,
};
