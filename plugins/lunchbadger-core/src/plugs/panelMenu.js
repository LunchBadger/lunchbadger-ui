import {clearServer, saveToServer} from '../reduxActions/project';
import {togglePanel} from '../reduxActions/states';
import {iconDetails} from '../../../../src/icons';

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
  2: {
    svg: iconDetails,
    panel: 'DETAILS_PANEL',
    action: togglePanel('DETAILS_PANEL'),
  },
  10: {
    icon: 'icon-icon-settings',
    panel:'SETTINGS_PANEL',
    action: togglePanel('SETTINGS_PANEL'),
  },
};
