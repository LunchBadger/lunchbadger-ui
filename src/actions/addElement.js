import {dispatch} from 'dispatcher/AppDispatcher';

export default (ref) => {
  dispatch('AddElement', {
    element: ref
  });
};
