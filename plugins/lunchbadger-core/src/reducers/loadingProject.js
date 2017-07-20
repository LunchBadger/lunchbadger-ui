const increaseRegExp = new RegExp(/load(.*)Request/);
const decreaseRegExp = new RegExp(/load(.*)(Success|Failure)/);

export default (state = 0, action) => {
  if (increaseRegExp.test(action.type)) return state + 1;
  if (decreaseRegExp.test(action.type)) return state - 1;
  return state;
};
