import {actions} from './actions';
import {ModelService} from '../services';
import Model from '../models/_model';

export const loadModels = () => async (dispatch) => {
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

export const addModel = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Model.create({itemOrder}, {loaded: false});
  dispatch(actions.addModel({entity}));
  return entity;
}

export const discardModelChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deleteModelSuccess({id}));
  }
}
