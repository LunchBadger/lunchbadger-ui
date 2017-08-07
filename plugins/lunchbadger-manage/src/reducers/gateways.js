import Gateway from '../models/Gateway';
import {actionTypes} from '../reduxActions/actions';
import Pipeline from '../models/Pipeline';
import Policy from '../models/Policy';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case coreActionTypes.onLoadProject:
      return action.payload.body.gateways.reduce((map, item) => {
        map[item.id] = Gateway.create({
          ...item,
          pipelines: item.pipelines.map(pipeline => Pipeline.create({
            ...pipeline,
            policies: pipeline.policies.map(policy => Policy.create(policy)),
          })),
        });
        return map;
      }, {});
    case actionTypes.updateGateway:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.updateGateways:
      action.payload.forEach((item) => {
        newState[item.id] = item;
      });
      return newState;
    case actionTypes.removeGateway:
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
