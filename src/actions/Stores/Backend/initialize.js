import DataSource from 'models/DataSource';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (data) => {
  const dataSources = data.dataSources;

  const dataSourceObjects = dataSources.map((dataSource, index) => {
    return DataSource.create({
      itemOrder: index,
      ...dataSource
    });
  });

  dispatch('InitializeBackend', {
    data: dataSourceObjects
  });
};
