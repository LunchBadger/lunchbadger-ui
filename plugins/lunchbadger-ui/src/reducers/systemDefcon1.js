const initialState = {
  errors: [],
  visible: false,
}

const systemDefcon1 = (state = initialState, action) => {
  switch (action.type) {
    case 'SYSTEM_DEFCON1/ADD':
      let newState = {...state};
      if (!state.errors.includes(action.error)) {
        newState = {
          errors: [
            action.error,
            ...newState.errors,
          ],
          visible: true,
        };
      };
      return newState;
    case 'SYSTEM_DEFCON1/TOGGLE':
      return {
        ...state,
        visible: !state.visible,
      };
    default:
      return state;
  }
}

export default systemDefcon1;
