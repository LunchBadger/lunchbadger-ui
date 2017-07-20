import API from '../models/API';

export default (state = [], action) => {
  // const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.project.apis.map((item, itemOrder) => API.create({
        itemOrder,
        loaded: true,
        ...item,
      }));
    default:
      return state;
  }
};
