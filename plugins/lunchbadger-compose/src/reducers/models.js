const Model = LunchBadgerManage.models.Model;

export default (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case 'APP_STATE/INITIALIZE':
      return action.data.models.map((item, itemOrder) => Model.create({
        itemOrder,
        loaded: true,
        ...item,
      }));
    case 'ADD_MODEL':
      newState.push({
        name: action.name,
      });
      return newState;
    default:
      return state;
  }
};
