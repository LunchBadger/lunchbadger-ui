import Portal from '../models/Portal';

export default (state = [], action) => {
  // const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.project.portals.map((item, itemOrder) => Portal.create({
        itemOrder,
        loaded: true,
        ready: true,
        ...item,
      }));
    default:
      return state;
  }
};
