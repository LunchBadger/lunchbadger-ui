import {dispatch} from 'dispatcher/AppDispatcher';

export default (model, key, value) => {
  dispatch('AddModelProperty', {
    model,
    key: key || ' ',
    value: value || ' '
  });
};
