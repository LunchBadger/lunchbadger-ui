import {dispatch} from 'dispatcher/AppDispatcher';

export default (id, props) => {
  dispatch('UpdateModel', {
    id: id,
    data: {...props}
  });
};
