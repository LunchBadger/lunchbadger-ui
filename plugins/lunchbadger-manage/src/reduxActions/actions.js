const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'updateServiceEndpoint',
    'updateServiceEndpoints',
    'removeServiceEndpoint',

    'updateApiEndpoint',
    'updateApiEndpoints',
    'removeApiEndpoint',

    'updateGateway',
    'updateGateways',
    'removeGateway',
    'addPipeline',
    'removePipeline',
    'addGatewayStatus',
  ],
);

export {
  actions,
  actionTypes,
};
