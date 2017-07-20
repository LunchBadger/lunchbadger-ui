import PublicEndpoint from '../models/PublicEndpoint';

export default (state = [], action) => {
  // const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.project.publicEndpoints.map((item, itemOrder) => PublicEndpoint.create({
        itemOrder,
        loaded: true,
        ...item,
      }));
    default:
      return state;
  }
};
