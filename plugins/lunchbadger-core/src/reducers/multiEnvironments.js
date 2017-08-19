import {actionTypes} from '../reduxActions/actions';

const defaultEnvironmentName = 'Environment';

const initialState = {
  selected: 0,
  environments: [
    {
      name: 'Development',
      delta: false,
      edit: false,
      entities: {},
    },
  ],
};

export default (state = initialState, action) => {
  const newState = {...state};
  switch (action.type) {
    case actionTypes.multiEnvironmentsSetSelected:
      return {
        ...state,
        selected: action.payload,
      };
    case actionTypes.multiEnvironmentsAdd:
      return {
        ...state,
        environments: [
          ...state.environments,
          {
            name: `${defaultEnvironmentName} 0${state.environments.length}`,
            delta: false,
            edit: false,
            entities: {},
          },
        ],
        selected: state.environments.length,
      }
    case actionTypes.multiEnvironmentsToggleDelta:
      newState.environments = [...newState.environments];
      newState.environments[action.payload].delta = !newState.environments[action.payload].delta;
      return newState;
    case actionTypes.multiEnvironmentsToggleNameEdit:
      newState.environments = [...newState.environments];
      newState.environments[action.payload.index].edit = action.payload.edit;
      return newState;
    case actionTypes.multiEnvironmentsUpdateName:
      newState.environments = [...newState.environments];
      newState.environments[action.payload.index].edit = false;
      newState.environments[action.payload.index].name = action.payload.name;
      return newState;
    case actionTypes.multiEnvironmentsUpdateEntity:
      newState.environments = [...newState.environments];
      newState.environments[action.payload.index].entities[action.payload.entity.id] = action.payload.entity;
      return newState;
    case actionTypes.multiEnvironmentsResetEntityField:
      newState.environments = [...newState.environments];
      const entity = newState.environments[action.payload.index].entities[action.payload.id].recreate();
      entity[action.payload.field] = action.payload.value;
      newState.environments[action.payload.index].entities[action.payload.id] = entity;
      return newState;
    case actionTypes.removeEntity:
      newState.environments = [...newState.environments];
      newState.environments.forEach((_, idx) => {
        delete newState.environments[idx].entities[action.payload.id];
      });
      return newState;
    default:
      return state;
  }
};
