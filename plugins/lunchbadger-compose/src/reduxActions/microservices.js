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

export const updateMicroservice = props => async (dispatch, getState) => {
  let entity = Microservice.create(props, {...props.metadata, processing: true});
  dispatch(actions.updateMicroserviceRequest({entity}));
  try {
    entity = Microservice.create(props);
    dispatch(actions.updateMicroserviceSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updateMicroserviceFailure', err);
    dispatch(actions.updateMicroserviceFailure(err));
  }
};

export const deleteMicroservice = props => async (dispatch) => {
  const entity = Microservice.create(props, {...props.metadata, processing: true});
  dispatch(actions.deleteMicroserviceRequest({entity}));
  try {
    dispatch(actions.deleteMicroserviceSuccess({id: props.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteMicroserviceFailure', err);
    dispatch(actions.deleteMicroserviceFailure(err));
  }
};

export const discardMicroserviceChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deleteMicroserviceSuccess({id}));
  }
}
