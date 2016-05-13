import DataSource from 'models/DataSource';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name, type) => {
  dispatch('AddDataSource', {
    dataSource: DataSource.create({
      name: name || 'DataSource',
      type: type || 'memory'
    })
  });
};
