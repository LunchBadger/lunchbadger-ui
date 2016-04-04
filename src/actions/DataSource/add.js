import {dispatch} from '../../dispatcher/AppDispatcher';
import DataSource from '../../models/DataSource';

export default () => {
  dispatch('AddDataSource', {
    dataSource: DataSource.create({
      name: 'DataSource'
    })
  });
};
