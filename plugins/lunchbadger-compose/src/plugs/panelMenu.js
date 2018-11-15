import Config from '../../../../src/config';
import {iconApiExplorer} from '../../../../src/icons';

const {coreActions} = LunchBadgerCore.utils;
const panelMenu = {};

if (Config.get('features').apiExplorer) {
  panelMenu[2] = {
    svg: iconApiExplorer,
    panel: 'API_EXPLORER_PANEL',
    action: coreActions.togglePanel('API_EXPLORER_PANEL'),
    tooltip: 'API Explorer',
  };
}

export default panelMenu;
