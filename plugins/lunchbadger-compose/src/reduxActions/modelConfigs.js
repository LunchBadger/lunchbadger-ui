import {actions} from './actions';
import {ModelConfigsService} from '../services';

const loadModelConfigs = () => async (dispatch) => {
  dispatch(actions.loadModelConfigsRequest());
  try {
    const data = await ModelConfigsService.load();
    dispatch(actions.loadModelConfigsSuccess(data));
  } catch (err) {
    dispatch(actions.loadModelConfigsFailure(err));
  }
};

export {
  loadModelConfigs,
};
