import {FORECASTS_PANEL} from '../components/Panel/ForecastsPanel';

const {utils: {coreActions, Config}} = LunchBadgerCore;
const panelMenu = {};

if (Config.get('features').forecasts) {
  panelMenu[5] = {
    icon: 'icon-icon-forecaster',
    panel: FORECASTS_PANEL,
    action: coreActions.togglePanel(FORECASTS_PANEL),
    tooltip: 'Forecasts',
  };
}

export default panelMenu;
