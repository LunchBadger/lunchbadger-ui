export default (props, nextProps, state = {}, nextState = {}) => {
  Object.keys(props).forEach((key) => {
    if (props[key] !== nextProps[key]) {
      console.log('DIFF PROPS', key, props[key], nextProps[key]);
    }
  });
  Object.keys(state).forEach((key) => {
    if (state[key] !== nextState[key]) {
      console.log('DIFF STATE', key, state[key], nextState[key]);
    }
  });
};
