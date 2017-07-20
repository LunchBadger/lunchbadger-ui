import DataSource from '../models/DataSource';

export default (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.dataSources.map((item, itemOrder) => DataSource.create({
        itemOrder,
        loaded: true,
        ...item,
      }));
    case 'ADD_DATASOURCE':
      newState.push(DataSource.create({
        name: action.name || 'DataSource',
        connector: action.connector || 'memory',
      }));
      return newState;
    default:
      return state;
  }
};
