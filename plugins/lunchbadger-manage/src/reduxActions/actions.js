const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'updatePrivateEndpoint',
    'removePrivateEndpoint',

    'updatePublicEndpoint',
    'removePublicEndpoint',

    'updateGateway',
    'removeGateway',
    'addPipeline',
    'removePipeline',
  ],
);

export {
  actions,
  actionTypes,
};
