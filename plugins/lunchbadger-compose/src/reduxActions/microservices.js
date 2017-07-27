import {actions} from './actions';
import Microservice from '../models/_microService';

export const addMicroservice = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Microservice.create({itemOrder}, {loaded: false});
  dispatch(actions.addMicroservice({entity}));
  return entity;
}

export const discardMicroserviceChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deleteMicroserviceSuccess({id}));
  }
}
