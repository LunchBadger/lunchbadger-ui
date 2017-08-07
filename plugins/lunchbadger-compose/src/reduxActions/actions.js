const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'onLoadDataSources',
    'updateDataSource',
    'updateDataSources',
    'removeDataSource',

    'onLoadModels',
    'updateModel',
    'updateModels',
    'removeModel',

    'onLoadModelConfigs',
    'updateMicroservice',
    'updateMicroservices',
    'removeMicroservice',
  ],
);

export {
  actions,
  actionTypes,
};
