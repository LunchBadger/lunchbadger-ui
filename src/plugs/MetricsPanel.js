import MetricsPanel, {METRICS_PANEL} from '../components/Panel/MetricsPanel';

const metricsPlugin = new LBCore.models.Plugin('MetricsPanelButton');
const metricsButton = new LBCore.models.PanelButtonComponent('fa-bar-chart', METRICS_PANEL);
const metricsPanel = new LBCore.models.PanelComponent(MetricsPanel);

metricsPlugin.registerPanel(metricsButton, metricsPanel, 0);

export default metricsPlugin;
