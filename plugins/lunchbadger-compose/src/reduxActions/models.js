import {actions} from './actions';
import {ModelService} from '../services';

const loadModels = () => async (dispatch) => {
  dispatch(actions.loadModelsRequest());
  try {
    const data = await ModelService.load();
    dispatch(actions.loadModelsSuccess(data));
  } catch (err) {
    dispatch(actions.loadModelsFailure(err));
  }
};

export {
  loadModels,
};
