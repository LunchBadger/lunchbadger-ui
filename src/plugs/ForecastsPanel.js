import ForecastsPanel, {FORECASTS_PANEL} from '../components/Panel/ForecastsPanel';

const forecastsPlugin = new LunchBadgerCore.models.Plugin('ForecastsPanelButton');
const forecastsButton = new LunchBadgerCore.models.PanelButtonComponent('icon-icon-forecaster', FORECASTS_PANEL);
const forecastsPanel = new LunchBadgerCore.models.PanelComponent(ForecastsPanel);

forecastsPlugin.registerPanel(forecastsButton, forecastsPanel, 1);

export default forecastsPlugin;
