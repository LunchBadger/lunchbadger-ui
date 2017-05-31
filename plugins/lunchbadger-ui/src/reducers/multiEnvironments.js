const defaultEnvironmentName = 'Environment';

const initialState = {
  selected: 0,
  environments: [
    {
      name: 'Development',
      delta: false,
    },
  ],
};

const multiEnvironments = (state = initialState, action) => {
  switch (action.type) {
    case 'MULTIENVIRONMENTS/SELECT':
      return {
        ...state,
        selected: action.index,
      };
    case 'MULTIENVIRONMENTS/ADD':
      return {
        ...state,
        environments: [
          ...state.environments,
          {
            name: `${defaultEnvironmentName} 0${state.environments.length}`,
            delta: false,
          },
        ],
        selected: state.environments.length,
      }
    case 'MULTIENVIRONMENTS/TOGGLE_DELTA':
      const newState = {...state};
      newState.environments = [...newState.environments];
      newState.environments[action.index].delta = !newState.environments[action.index].delta;
      return newState;
    default:
      return state;
  }
}

export default multiEnvironments;
