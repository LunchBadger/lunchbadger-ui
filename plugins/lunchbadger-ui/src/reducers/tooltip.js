const initialState = {
  content: null,
  left: 0,
  top: 0,
};

const multiEnvironments = (state = initialState, action) => {
  switch (action.type) {
    case 'TOOLTIP/SET':
      return {
        content: action.content,
        left: action.left,
        top: action.top,
      };
    default:
      return state;
  }
}

export default multiEnvironments;
