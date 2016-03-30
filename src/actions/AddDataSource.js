import { dispatch } from '../dispatcher/AppDispatcher';

export default () => {
  dispatch('AddDataSource', {
  	dataSource: {
  		name: 'DataSource'
  	}
  });
};