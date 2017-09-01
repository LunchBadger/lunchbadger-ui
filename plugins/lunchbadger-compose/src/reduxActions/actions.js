const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'onLoadCompose',

    'updateDataSource',
    'updateDataSources',
    'removeDataSource',

    'updateModel',
    'updateModelBundled',
    'updateModels',
    'removeModel',
    'removeModelBundled',

    'updateMicroservice',
    'updateMicroservices',
    'removeMicroservice',
  ],
);

export {
  actions,
  actionTypes,
};
