import {METRICS_PANEL} from '../components/Panel/MetricsPanel';
const {coreActions} = LunchBadgerCore.utils;

export default {
  3: {
    icon: 'icon-icon-metrics',
    panel: METRICS_PANEL,
    action: coreActions.togglePanel(METRICS_PANEL),
  },
};
