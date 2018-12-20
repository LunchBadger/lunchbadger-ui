import Config from '../../../../src/config';

const {
  utils: {coreActions},
  UI: {icons: {iconApiExplorer}},
} = LunchBadgerCore;

const panelMenu = {};

if (Config.get('features').apiExplorer) {
  panelMenu[3] = {
    svg: iconApiExplorer,
    panel: 'API_EXPLORER_PANEL',
    action: coreActions.togglePanel('API_EXPLORER_PANEL'),
    tooltip: 'API Explorer',
  };
}

export default panelMenu;
