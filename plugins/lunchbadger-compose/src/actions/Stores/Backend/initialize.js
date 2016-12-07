import DataSource from '../../../models/DataSource';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (dataSources) => {
  const dataSourceObjects = dataSources.map((dataSource, index) => {
    return DataSource.create({
      itemOrder: index,
      loaded: true,
      ...dataSource
    });
  });

  dispatch('InitializeBackend', {
    data: dataSourceObjects
  });
};
