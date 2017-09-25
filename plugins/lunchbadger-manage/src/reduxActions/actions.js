const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'updateServiceEndpoint',
    'updateServiceEndpoints',
    'removeServiceEndpoint',

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
