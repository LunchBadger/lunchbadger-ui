import {actions} from './actions';
import API from '../models/_API';

export const addAPI = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = API.create({itemOrder}, {loaded: false});
  dispatch(actions.addAPI({entity}));
  return entity;
}

export const updateAPI = props => async (dispatch, getState) => {
  let entity = API.create(props, {...props.metadata, processing: true});
  dispatch(actions.updateAPIRequest({entity}));
  try {
    entity = API.create(props);
    dispatch(actions.updateAPISuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updateAPIFailure', err);
    dispatch(actions.updateAPIFailure(err));
  }
};

export const deleteAPI = props => async (dispatch) => {
  const entity = API.create(props, {...props.metadata, processing: true});
  dispatch(actions.deleteAPIRequest({entity}));
  try {
    dispatch(actions.deleteAPISuccess({id: props.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteAPIFailure', err);
    dispatch(actions.deleteAPIFailure(err));
  }
};

export const discardAPIChanges = ({metadata: {loaded, id}}) => (dispatch, getState) => {
  if (!loaded) {
    dispatch(actions.deleteAPISuccess({id}));
    return {};
  } else {
    const props = getState().states.currentEditElement;
    const entity = API.create(props);
    dispatch(actions.updateAPISuccess({entity}));
    return API.toJSON(entity);
  }
}
