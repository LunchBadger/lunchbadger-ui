import {dispatch} from 'dispatcher/AppDispatcher';
import Model from 'models/Model';

export default (name) => {
  dispatch('AddModel', {
    model: Model.create({
      name: name || 'Model'
    })
  });
};
