export default (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case 'ADD_MODEL':
      newState.push({
        name: action.name,
      });
      return newState;
    default:
      return state;
  }
};
