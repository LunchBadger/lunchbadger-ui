import _ from 'lodash';

export default (name = '') => {
  if (name === name.toUpperCase()) return name.toLowerCase();
  if (~name.indexOf('-')) return name.toLowerCase();
  const dashed = _.kebabCase(name);
  const split = dashed.split('');
  if (split[0] === '-') split.shift();
  const res = split.join('');
  return `${res}.js`;
}
