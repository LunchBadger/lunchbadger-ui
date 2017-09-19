import Model from '../models/Model.js';
import ModelProperty from '../models/ModelProperty';
import ModelRelation from '../models/ModelRelation';
import {actionTypes} from '../reduxActions/actions';

const {actionTypes: coreActionTypes} = LunchBadgerCore.utils;

export default (state = {}, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.onLoadCompose:
      return action.payload[1].body.reduce((map, item) => {
        if (!item.wasBundled) return map;
        const properties = item.properties || [];
        const relations = item.relations || [];
        delete item.properties;
        delete item.relations;
        const model = Model.create(item);
        properties.forEach(property => model.addProperty(ModelProperty.create(property)));
        relations.forEach(relation => model.addRelation(ModelRelation.create(relation)));
        map[item.lunchbadgerId] = model;
        return map;
      }, {});
    case actionTypes.updateModelBundled:
      newState[action.payload.id] = action.payload;
      return newState;
    case actionTypes.removeModelBundled:
      delete newState[action.payload.id];
      return newState;
    case coreActionTypes.clearProject:
      return {};
    default:
      return state;
  }
};
