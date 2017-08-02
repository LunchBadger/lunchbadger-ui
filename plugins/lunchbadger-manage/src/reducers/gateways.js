import Gateway from '../models/_gateway';
import {actionTypes} from '../reduxActions/actions';
import Pipeline from '../models/_pipeline';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        map[item.id] = Gateway.create(item);
        return map;
      }, {});
    case actionTypes.addGateway:
    case actionTypes.updateGatewayRequest:
    case actionTypes.updateGatewaySuccess:
    case actionTypes.deleteGatewayRequest:
      newState[action.payload.entity.metadata.id] = action.payload.entity;
      return newState;
    case actionTypes.deleteGatewaySuccess:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    case actionTypes.addPipeline:
      newState[action.payload].pipelines = [
        ...newState[action.payload].pipelines,
        Pipeline.create(),
      ];
      return newState;
    default:
      return state;
  }
};
