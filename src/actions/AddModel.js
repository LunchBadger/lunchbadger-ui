import {dispatch} from '../dispatcher/AppDispatcher';
import Model from '../models/Model';

export default () => {
  dispatch('AddModel', {
    model: Model.create({
      name: 'Model'
    })
  });
};
