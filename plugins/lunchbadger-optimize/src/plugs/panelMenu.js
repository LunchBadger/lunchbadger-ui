import {FORECASTS_PANEL} from '../components/Panel/ForecastsPanel';
import Config from '../../../../src/config';

const {coreActions} = LunchBadgerCore.utils;
const panelMenu = {};

if (Config.get('features').forecasts) {
  panelMenu[4] = {
    icon: 'icon-icon-forecaster',
    panel: FORECASTS_PANEL,
    action: coreActions.togglePanel(FORECASTS_PANEL),
  };
}

export default panelMenu;
