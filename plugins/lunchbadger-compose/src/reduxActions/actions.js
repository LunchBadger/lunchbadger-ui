const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'updateDataSource',
    'deleteDataSource',

    'updateModel',
    'deleteModel',


    'updateMicroservice',
    'deleteMicroservice',
  ],
  [
    'onLoadDataSources',
    'addDataSource',

    'onLoadModels',
    'addModel',

    'onLoadModelConfigs',
    'addMicroservice',
  ],
);

export {
  actions,
  actionTypes,
};
