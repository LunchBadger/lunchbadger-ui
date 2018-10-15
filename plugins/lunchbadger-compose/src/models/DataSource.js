import dataSources from './DataSources';
export default {
  create: data => dataSources[data.connector].create(data),
};
