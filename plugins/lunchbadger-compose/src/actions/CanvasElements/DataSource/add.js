import DataSource from '../../../models/DataSource';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name, connector) => {
  dispatch('AddDataSource', {
    entity: DataSource.create({
      name: name || 'DataSource',
      connector: connector || 'memory'
    })
  });
};
