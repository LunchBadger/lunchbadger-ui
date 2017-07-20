import {actions} from './actions';
import {DataSourceService} from '../services';

const loadDataSources = () => async (dispatch, getState) => {
  dispatch(actions.loadDataSourcesRequest());
  try {
    const data = await DataSourceService.load();
    dispatch(actions.loadDataSourcesSuccess(data));
  } catch (err) {
    dispatch(actions.loadDataSourcesFailure(err));
  }
};

export {
  loadDataSources,
};
