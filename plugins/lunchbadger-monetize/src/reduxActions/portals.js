import {actions} from './actions';
import Portal from '../models/_Portal';

export const addPortal = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[3].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Portal.create({itemOrder}, {loaded: false});
  dispatch(actions.addPortal({entity}));
  return entity;
}

export const updatePortal = props => async (dispatch, getState) => {
  let entity = Portal.create(props, {...props.metadata, processing: true});
  dispatch(actions.updatePortalRequest({entity}));
  try {
    entity = Portal.create(props);
    dispatch(actions.updatePortalSuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updatePortalFailure', err);
    dispatch(actions.updatePortalFailure(err));
  }
};

export const deletePortal = props => async (dispatch) => {
  const entity = Portal.create(props, {...props.metadata, processing: true});
  dispatch(actions.deletePortalRequest({entity}));
  try {
    dispatch(actions.deletePortalSuccess({id: props.metadata.id}));
  } catch (err) {
    console.log('ERROR deletePortalFailure', err);
    dispatch(actions.deletePortalFailure(err));
  }
};

export const discardPortalChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deletePortalSuccess({id}));
  }
}
