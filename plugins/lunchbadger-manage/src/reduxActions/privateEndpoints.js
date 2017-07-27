import {actions} from './actions';
import PrivateEndpoint from '../models/_privateEndpoint';

export const addPrivateEndpoint = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = PrivateEndpoint.create({itemOrder}, {loaded: false});
  dispatch(actions.addPrivateEndpoint({entity}));
  return entity;
}

export const updatePrivateEndpoint = ({data, metadata}) => async (dispatch, getState) => {
  let entity = PrivateEndpoint.create(data, {processing: true});
  dispatch(actions.updatePrivateEndpointRequest({entity}));
  try {
    entity = PrivateEndpoint.create(data);
    dispatch(actions.updatePrivateEndpointSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updatePrivateEndpointFailure', err);
    dispatch(actions.updatePrivateEndpointFailure(err));
  }
};

export const deletePrivateEndpoint = ({data, metadata}) => async (dispatch) => {
  const entity = PrivateEndpoint.create(data, {...metadata, processing: true});
  dispatch(actions.deletePrivateEndpointRequest({entity}));
  try {
    dispatch(actions.deletePrivateEndpointSuccess({id: entity.metadata.id}));
  } catch (err) {
    console.log('ERROR deletePrivateEndpointFailure', err);
    dispatch(actions.deletePrivateEndpointFailure(err));
  }
};

export const discardPrivateEndpointChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deletePrivateEndpointSuccess({id}));
  }
}
