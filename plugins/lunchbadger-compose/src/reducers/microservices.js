import Microservice from '../models/Microservice';

export default (state = [], action) => {
  // const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.project.microServices.map((item, itemOrder) => Microservice.create({
        itemOrder,
        loaded: true,
        ready: true,
        ...item,
      }));
    default:
      return state;
  }
};
