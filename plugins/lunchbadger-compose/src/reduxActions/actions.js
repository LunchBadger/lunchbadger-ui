const {actions, actionTypes} = LunchBadgerCore.utils.actionsCreator(
  [
    'loadDataSources',
    'updateDataSource',
    'deleteDataSource',
    'loadModels',
    'loadModelConfigs',
  ],
  [
    'addDataSource',
  ],
);

export {
  actions,
  actionTypes,
};
