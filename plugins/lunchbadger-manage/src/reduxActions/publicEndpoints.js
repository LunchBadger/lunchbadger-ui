import {actions} from './actions';
import PublicEndpoint from '../models/_publicEndpoint';

export const addPublicEndpoint = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = PublicEndpoint.create({itemOrder}, {loaded: false});
  dispatch(actions.addPublicEndpoint({entity}));
  return entity;
}

export const updatePublicEndpoint = props => async (dispatch, getState) => {
  let entity = PublicEndpoint.create(props, {...props.metadata, processing: true});
  dispatch(actions.updatePublicEndpointRequest({entity}));
  try {
    entity = PublicEndpoint.create(props);
    dispatch(actions.updatePublicEndpointSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updatePublicEndpointFailure', err);
    dispatch(actions.updatePublicEndpointFailure(err));
  }
};

export const deletePublicEndpoint = props => async (dispatch) => {
  const entity = PublicEndpoint.create(props, {...props.metadata, processing: true});
  dispatch(actions.deletePublicEndpointRequest({entity}));
  try {
    dispatch(actions.deletePublicEndpointSuccess({id: props.metadata.id}));
  } catch (err) {
    console.log('ERROR deletePublicEndpointFailure', err);
    dispatch(actions.deletePublicEndpointFailure(err));
  }
};

export const discardPublicEndpointChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deletePublicEndpointSuccess({id}));
  }
}
