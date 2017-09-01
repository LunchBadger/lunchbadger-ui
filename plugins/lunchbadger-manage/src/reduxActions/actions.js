const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'updatePrivateEndpoint',
    'updatePrivateEndpoints',
    'removePrivateEndpoint',

    'updatePublicEndpoint',
    'updatePublicEndpoints',
    'removePublicEndpoint',

    'updateGateway',
    'updateGateways',
    'removeGateway',
    'addPipeline',
    'removePipeline',
  ],
);

export {
  actions,
  actionTypes,
};
