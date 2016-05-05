import ForecastsPanel, {FORECASTS_PANEL} from '../components/Panel/ForecastsPanel';

const forecastsPlugin = new LBCore.models.Plugin('ForecastsPanelButton');
const forecastsButton = new LBCore.models.PanelButtonComponent('fa-cog', FORECASTS_PANEL);
const forecastsPanel = new LBCore.models.PanelComponent(ForecastsPanel);

forecastsPlugin.registerPanel(forecastsButton, forecastsPanel, 1);

export default forecastsPlugin;
