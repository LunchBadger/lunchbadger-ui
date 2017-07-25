import DataSource from '../models/_dataSource';
import {actionTypes} from '../reduxActions/actions';

export default (state = {}, action) => {
  // const newState = [...state];
  switch (action.type) {
    case actionTypes.loadDataSourcesSuccess:
      return action.payload.entities;
    // case actionTypes.addDataSource:
    //   return [
    //     ...state,
    //     DataSource.create(action.payload, {loaded: false, editable: true}),
    //   ];
    // case actionTypes.updateDataSourceRequest:
    //   return [
    //     ...state.filter(({data: {lunchbadgerId}}) => lunchbadgerId !== action.payload.lunchbadgerId),
    //     DataSource.create(action.payload.entity, {ready: false}),
    //   ];
    // case actionTypes.updateDataSourceSuccess:
    //   return [
    //     ...state.filter(({data: {lunchbadgerId}}) => lunchbadgerId !== action.payload.lunchbadgerId),
    //     DataSource.create(action.payload.entity),
    //   ];
    // case actionTypes.deleteDataSourceRequest:
    //   newState.find(({data: {lunchbadgerId}}) => lunchbadgerId === action.payload.lunchbadgerId).metadata.ready = false;
    //   return newState;
    // case actionTypes.deleteDataSourceSuccess:
    //   return state.filter(({data: {lunchbadgerId}}) => lunchbadgerId !== action.payload.lunchbadgerId);
    default:
      return state;
  }
};
