import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/_model';

const loadModels = () => async (dispatch) => {
  dispatch(actions.loadModelsRequest());
  try {
    const data = await ModelService.load();
    const entities = data.body.reduce((map, item) => {
      map[item.lunchbadgerId] = Model.create(item);
      return map;
    }, {});
    dispatch(actions.loadModelsSuccess({entities}));
  } catch (err) {
    console.log('ERROR loadModelsFailure', err);
    dispatch(actions.loadModelsFailure(err));
  }
};

export {
  loadModels,
};
