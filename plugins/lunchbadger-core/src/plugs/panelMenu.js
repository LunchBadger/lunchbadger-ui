import {clearServer, saveToServer, logout} from '../reduxActions/project';
import {togglePanel} from '../reduxActions/states';
import {iconLogout} from '../../../../src/icons';
import Config from '../../../../src/config';

export default {
  0: {
    icon: 'fa-floppy-o',
    hidden: true,
    action: saveToServer(),
    tooltip: 'Save project',
  },
  1: {
    icon: 'fa-trash-o',
    hidden: false,
    confirm: {
      title: 'Clear the workspace',
      ok: 'Clear',
      message: 'Are you sure, you want to clear the workspace?',
    },
    action: clearServer(),
    tooltip: 'Clear project',
  },
  10: {
    icon: 'icon-icon-settings',
    panel: 'SETTINGS_PANEL',
    action: togglePanel('SETTINGS_PANEL'),
    tooltip: 'Settings',
  },
  11: {
    icon: 'fa-question',
    name: 'documentation',
    url: Config.get('docsUrl'),
    tooltip: 'Documentation',
  },
  12: {
    svg: iconLogout,
    action: logout(),
    confirm: {
      title: 'Logging out',
      ok: 'Log out',
      message: 'Are you sure, you want to log out from the workspace?',
    },
    tooltip: 'Logout',
  },
};
