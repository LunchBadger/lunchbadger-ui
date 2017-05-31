const environments = [
  {name: 'Testing'},
  {name: 'Staging'},
];

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
            ...Object.assign({}, environments[state.environments.length - 1]),
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
