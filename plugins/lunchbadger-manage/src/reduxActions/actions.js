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
    'addPipeline',
  ],
);

export {
  actions,
  actionTypes,
};
