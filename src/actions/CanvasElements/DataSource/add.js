import DataSource from 'models/DataSource';

const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddDataSource', {
    dataSource: DataSource.create({
      name: name || 'DataSource'
    })
  });
};
