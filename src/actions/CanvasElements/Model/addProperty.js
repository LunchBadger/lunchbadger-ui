import {dispatch} from 'dispatcher/AppDispatcher';

export default (model, attrs) => {
  dispatch('AddModelProperty', {
    model,
    attrs
  });
};
