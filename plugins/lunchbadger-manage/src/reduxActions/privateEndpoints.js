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

export const updatePrivateEndpoint = props => async (dispatch, getState) => {
  let entity = PrivateEndpoint.create(props, {...props.metadata, processing: true});
  dispatch(actions.updatePrivateEndpointRequest({entity}));
  try {
    entity = PrivateEndpoint.create(props);
    dispatch(actions.updatePrivateEndpointSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updatePrivateEndpointFailure', err);
    dispatch(actions.updatePrivateEndpointFailure(err));
  }
};

export const deletePrivateEndpoint = props => async (dispatch) => {
  const entity = PrivateEndpoint.create(props, {...props.metadata, processing: true});
  dispatch(actions.deletePrivateEndpointRequest({entity}));
  try {
    dispatch(actions.deletePrivateEndpointSuccess({id: props.metadata.id}));
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
