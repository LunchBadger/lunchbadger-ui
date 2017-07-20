import {actionTypes} from '../reduxActions/actions';

const Model = LunchBadgerManage.models.Model;

const initialState = {
  loaded: false,
  data: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.loadModelsSuccess:
      return {
        loaded: true,
        data: action.payload.body.map((item, itemOrder) => Model.create({
          itemOrder,
          loaded: true,
          ...item,
          properties: [], // FIXME
        })),
      };
    default:
      return state;
  }
};
