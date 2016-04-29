import {dispatch} from 'dispatcher/AppDispatcher';

export default (element) => {
  dispatch('ToggleHighlight', {
    element: element
  });
};
