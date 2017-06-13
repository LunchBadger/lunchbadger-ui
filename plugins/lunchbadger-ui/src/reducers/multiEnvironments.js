const defaultEnvironmentName = 'Environment';

const initialState = {
  selected: 0,
  environments: [
    {
      name: 'Development',
      delta: false,
      edit: false,
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
            edit: false,
          },
        ],
        selected: state.environments.length,
      }
    case 'MULTIENVIRONMENTS/TOGGLE_DELTA':
      const newState = {...state};
      newState.environments = [...newState.environments];
      newState.environments[action.index].delta = !newState.environments[action.index].delta;
      return newState;
    case 'MULTIENVIRONMENTS/TOGGLE_NAME_EDIT':
      const newState2 = {...state};
      newState2.environments = [...newState2.environments];
      newState2.environments[action.index].edit = action.edit;
      return newState2;
    case 'MULTIENVIRONMENTS/UPDATE_NAME':
      const newState3 = {...state};
      newState3.environments = [...newState3.environments];
      newState3.environments[action.index].edit = false;
      newState3.environments[action.index].name = action.name;
      return newState3;
    default:
      return state;
  }
}

export default multiEnvironments;
