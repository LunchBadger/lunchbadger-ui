import {clearServer, saveToServer, logout} from '../reduxActions/project';
import {togglePanel} from '../reduxActions/states';
import Config from '../../../../src/config';
import {GAEvent} from '../ui';
import icons from '../ui/icons';

const {iconLogout, iconProject} = icons;

const panelMenu = {
  0: {
    name: 'projectSave',
    icon: 'fa-floppy-o',
    hidden: true,
    action: saveToServer({manualSave: true}),
    tooltip: 'Save project',
  },
  1: {
    name: 'projectClear',
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
    action: () => GAEvent('Header Menu', 'Documentation'),
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

if (document.location.search.includes('multiuser')) {
  panelMenu[2] = {
    svg: iconProject,
    panel: 'MANAGE_PROJECT',
    action: () => {},
    tooltip: 'Manage projects',
  };
}

export default panelMenu;
