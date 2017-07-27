const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'loadDataSources',
    'updateDataSource',
    'deleteDataSource',

    'loadModels',
    'updateModel',
    'deleteModel',

    'loadModelConfigs',

    'updateMicroservice',
    'deleteMicroservice',
  ],
  [
    'addDataSource',
    'addModel',
    'addMicroservice',
  ],
);

export {
  actions,
  actionTypes,
};
