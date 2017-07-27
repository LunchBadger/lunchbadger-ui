const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'updatePrivateEndpoint',
    'deletePrivateEndpoint',
  ],
  [
    'addPrivateEndpoint',
  ],
);

export {
  actions,
  actionTypes,
};
