const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'updatePrivateEndpoint',
    'deletePrivateEndpoint',

    'updatePublicEndpoint',
    'deletePublicEndpoint',

    'updateGateway',
    'deleteGateway',
  ],
  [
    'addPrivateEndpoint',

    'addPublicEndpoint',

    'addGateway',
  ],
);

export {
  actions,
  actionTypes,
};
