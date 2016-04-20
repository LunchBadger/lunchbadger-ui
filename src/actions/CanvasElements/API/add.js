import { dispatch } from 'dispatcher/AppDispatcher';
import API from 'models/API';

export default () => {
  dispatch('AddAPI', {
    API: API.create({
      name: 'API'
    })
  });
};
