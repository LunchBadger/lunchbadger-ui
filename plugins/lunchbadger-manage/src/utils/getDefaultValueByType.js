export default type => ({
  string: '',
  boolean: false,
  integer: 0,
  number: 0,
  jscode: '',
  array: [],
  object: {},
})[type];
