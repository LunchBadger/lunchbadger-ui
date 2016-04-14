import {dispatch} from '../../dispatcher/AppDispatcher';
import DataSource from '../../models/DataSource';

export default (name) => {
  dispatch('AddDataSource', {
    dataSource: DataSource.create({
      name: name || 'DataSource'
    })
  });
};
