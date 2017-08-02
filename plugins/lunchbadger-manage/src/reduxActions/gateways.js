import {actions} from './actions';
import Gateway from '../models/_gateway';
import Pipeline from '../models/_pipeline';

export const addGateway = () => (dispatch, getState) => {
  const {entities, plugins: {quadrants}} = getState();
  const types = quadrants[1].entities;
  const itemOrder = types.reduce((map, type) => map + Object.keys(entities[type]).length, 0);
  const entity = Gateway.create({itemOrder}, {loaded: false});
  dispatch(actions.addGateway({entity}));
  return entity;
}

export const updateGateway = props => async (dispatch) => {
  let entity = Gateway.create(props, {...props.metadata, processing: true});
  dispatch(actions.updateGatewayRequest({entity}));
  try {
    entity = Gateway.create(props);
    dispatch(actions.updateGatewaySuccess({entity}));
    return entity;
  } catch (err) {
    console.log('ERROR updateGatewayFailure', err);
    dispatch(actions.updateGatewayFailure(err));
  }
};

export const addPipeline = gatewayId => (dispatch, getState) => {
  const props = {...getState().entities.gateways[gatewayId]};
  props.pipelines = [...props.pipelines, Pipeline.create()];
  const entity = Gateway.create(props);
  dispatch(actions.updateGatewaySuccess({entity}));
}

export const removePipeline = (gatewayId, pipelineId) => (dispatch, getState) => {
  const props = {...getState().entities.gateways[gatewayId]};
  props.pipelines = props.pipelines.filter(p => p.id !== pipelineId);
  const entity = Gateway.create(props);
  dispatch(actions.updateGatewaySuccess({entity}));
}

export const deleteGateway = props => async (dispatch) => {
  const entity = Gateway.create(props, {...props.metadata, processing: true});
  dispatch(actions.deleteGatewayRequest({entity}));
  try {
    dispatch(actions.deleteGatewaySuccess({id: props.metadata.id}));
  } catch (err) {
    console.log('ERROR deleteGatewayFailure', err);
    dispatch(actions.deleteGatewayFailure(err));
  }
};

export const discardGatewayChanges = ({metadata: {loaded, id}}) => (dispatch) => {
  if (!loaded) {
    dispatch(actions.deleteGatewaySuccess({id}));
  }
}
