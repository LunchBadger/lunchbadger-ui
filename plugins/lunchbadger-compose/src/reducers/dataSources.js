export default (state = [], action) => {
  const newState = [...state];
  switch (action.type) {
    case 'ADD_DATASOURCE':
      newState.push({
        name: action.name,
        connector: action.connector,
      });
      return newState;
    default:
      return state;
  }
};
