import {actionTypes} from '../reduxActions/actions';

const Model = LunchBadgerManage.models.Model;

export default (state = [], action) => {
  switch (action.type) {
    case actionTypes.loadModelsSuccess:
      return action.payload.body.map((item, itemOrder) => Model.create({
        itemOrder,
        loaded: true,
        ...item,
        properties: [], // FIXME
      }));
    default:
      return state;
  }
};
