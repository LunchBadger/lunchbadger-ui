import Gateway from '../models/Gateway';

export default (state = [], action) => {
  // const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.project.gateways.map((item, itemOrder) => Gateway.create({
        itemOrder,
        loaded: true,
        ready: true,
        ...item,
      }));
    default:
      return state;
  }
};
