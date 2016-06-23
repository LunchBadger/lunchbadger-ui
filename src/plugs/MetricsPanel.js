import MetricsPanel, {METRICS_PANEL} from '../components/Panel/MetricsPanel';

const metricsPlugin = new LunchBadgerCore.models.Plugin('MetricsPanelButton');
const metricsButton = new LunchBadgerCore.models.PanelButtonComponent('icon-icon-metrics', METRICS_PANEL);
const metricsPanel = new LunchBadgerCore.models.PanelComponent(MetricsPanel);

metricsPlugin.registerPanel(metricsButton, metricsPanel, 0);

export default metricsPlugin;
