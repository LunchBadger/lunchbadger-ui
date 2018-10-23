export default type => ({
  string: '',
  boolean: false,
  integer: 0,
  number: 0,
  jscode: '',
  array: [],
  object: {},
  date: '2018-01-01T00:00',
  geopoint: [0,0],
})[type];
