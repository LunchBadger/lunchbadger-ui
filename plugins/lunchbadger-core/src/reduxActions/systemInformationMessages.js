import {actions} from './actions';

export const addSystemInformationMessage = message => dispatch =>
  dispatch(actions.addSystemInformationMessage(message));

export const removeSystemInformationMessages = messages => dispatch =>
  dispatch(actions.removeSystemInformationMessages(messages));
