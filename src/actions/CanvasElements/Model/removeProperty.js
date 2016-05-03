import {dispatch} from 'dispatcher/AppDispatcher';

export default (model, property) => {
  dispatch('RemoveModelProperty', {
    model,
    property
  });
};
