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
    'updateModelBundled',
    'updateModels',
    'removeModel',
    'removeModelBundled',

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
