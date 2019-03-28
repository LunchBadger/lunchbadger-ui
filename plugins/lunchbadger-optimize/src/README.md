# Optimize plugin (future)

Optimize plugin serves:
- forecasts panel, where user can drag API entities from the canvas, to show their usage and forecasts

## Forecasts panel

Metric panel is defined by:
- `models/ForecastAPI` model
- `reducers/forecasts` redux reducer
- `reduxActions/forecasts` redux actions
- `services/ForecastService` api service
- `components/Panel/ForecastsPanel` panel component
- `components/PanelComponents/APIForecast` api forecast item component displayed in the forecasts panel

## API Forecast item box

API Forecast item box is rendered using composite components stored in `components/PanelComponents/Subelements` folder:
- `ForecastNav` with icons to expand/collapse box, and remove box from forecasts panel
- `ForecastResizeHandle` with icon to resize box on the panel
- `ForecastDetails` forecasts details wrapper
- `ForecastDetailsTop` rendering basic informations about api usage:
  - annual recurring
  - monthly recurring
  - retention
  - paying users
  - total users
- `ForecastingChart` rendering chart with monthly api usage/forecast for selected date range
- `ForecastDetailsBottom` rendering basic informations about selected date range period:
  - new users
  - upgrades
  - existing
  - downgrades
  - churn

Additionally, when api forecast box is extended, following components are displayed:
- `ForecastPlans` - api plans
- `ForecastPlanDetails` - api plan details
- `Tier` - tier details for api plan

## Forecast Service

As it is now, forecast api service is smoke and mirrors, and returns mock api usage/forecast data.
