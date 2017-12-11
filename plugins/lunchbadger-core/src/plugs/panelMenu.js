import {clearServer, saveToServer, logout} from '../reduxActions/project';
import {togglePanel} from '../reduxActions/states';
import {iconLogout} from '../../../../src/icons';

export default {
  0: {
    icon: 'fa-trash-o',
    hidden: true,
    confirm: {
      title: 'Clear the workspace',
      ok: 'Clear',
      message: 'Are you sure, you want to clear the workspace?',
    },
    action: clearServer(),
  },
  1: {
    icon: 'fa-floppy-o',
    action: saveToServer(),
  },
  10: {
    icon: 'icon-icon-settings',
    panel:'SETTINGS_PANEL',
    action: togglePanel('SETTINGS_PANEL'),
  },
  11: {
    svg: iconLogout,
    action: logout(),
    confirm: {
      title: 'Logging out',
      ok: 'Log out',
      message: 'Are you sure, you want to log out from the workspace?',
    },
  },
};
