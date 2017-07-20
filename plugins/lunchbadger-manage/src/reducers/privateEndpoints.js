import PrivateEndpoint from '../models/PrivateEndpoint';

export default (state = [], action) => {
  // const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.project.privateEndpoints.map((item, itemOrder) => PrivateEndpoint.create({
        itemOrder,
        loaded: true,
        ...item,
      }));
    default:
      return state;
  }
};
