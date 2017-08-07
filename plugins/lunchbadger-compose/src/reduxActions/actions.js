const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [

  ],
  [
    'onLoadDataSources',
    'updateDataSource',
    'removeDataSource',

    'onLoadModels',
    'updateModel',
    'removeModel',

    'onLoadModelConfigs',
    'updateMicroservice',
    'removeMicroservice',
  ],
);

export {
  actions,
  actionTypes,
};
