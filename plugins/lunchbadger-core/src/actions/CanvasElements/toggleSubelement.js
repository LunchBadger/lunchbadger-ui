import {dispatch} from 'dispatcher/AppDispatcher';

export default (parent, subelement) => {
  dispatch('ToggleSubelement', {
    parent,
    subelement
  });
}
