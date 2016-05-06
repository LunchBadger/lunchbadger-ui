import DataSource from 'models/DataSource';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddDataSource', {
    dataSource: DataSource.create({
      name: name || 'DataSource'
    })
  });
};
