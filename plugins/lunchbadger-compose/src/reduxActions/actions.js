const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'loadDataSources',
    'updateDataSource',
    'deleteDataSource',
    'loadModels',
    'loadModelConfigs',
    // 'loadMicroservices',
  ],
  [
    'addDataSource',
  ],
);

export {
  actions,
  actionTypes,
};
