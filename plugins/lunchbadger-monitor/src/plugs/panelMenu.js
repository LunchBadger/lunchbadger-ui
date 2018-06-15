import {METRICS_PANEL} from '../components/Panel/MetricsPanel';
import Config from '../../../../src/config';

const {coreActions} = LunchBadgerCore.utils;
const panelMenu = {};

if (Config.get('features').metrics) {
  panelMenu[3] = {
    icon: 'icon-icon-metrics',
    panel: METRICS_PANEL,
    action: coreActions.togglePanel(METRICS_PANEL),
    tooltip: 'Metrics',
  };
}

export default panelMenu;
