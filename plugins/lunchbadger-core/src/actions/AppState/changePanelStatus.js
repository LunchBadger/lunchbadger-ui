import {dispatch} from '../../dispatcher/AppDispatcher';

export default (status, saveAction, discardAction) => {
  dispatch('ChangePanelStatus', {
    status,
    saveAction,
    discardAction
  });
}
