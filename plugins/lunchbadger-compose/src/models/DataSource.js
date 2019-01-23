import dataSources from './DataSources';

export default {
  create: data => {
    if (data.connector === 'loopback-component-storage') {
      data.connector = 'storage';
    }
    return dataSources[data.connector].create(data);
  },
};
