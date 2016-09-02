import {dispatch} from '../dispatcher/AppDispatcher';

export default (panelKey) => {
  dispatch('TogglePanel', {
    panelKey
  });
};
