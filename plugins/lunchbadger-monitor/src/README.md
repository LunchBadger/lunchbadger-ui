# Metric plugin (future)

Metric plugin serves:
- metric panel, where user can drag entities from the canvas, to show their metrics

## Metric panel

Metric panel is defined by:
- `models/Metric` model
- `reducers/metrics` redux reducer
- `reduxActions/metrics` redux actions
- `components/Panel/MetricPanel` panel component
- `components/Metric/Metric` metric item component displayed in the metric panel

## Metric item box

Metric item box is rendered using composite components stored in `components/metric/Subelements` folder:
- `MetricHeader` header with entity name, or - in case of paired entities - their names, together with metric type
- `MetricType` displayed in the metric header, showing selector type (one of `OR`, `AND`, `NOT`)
- `MetricTypeTooltip` tooltip displayed when user click metric type to switch selector type between `OR`, `AND`, and `NOT`
- `MetricDetails` rendering metric details by the following categories: Total Apps, Total Users, Total Api Requests and Total Requests
- `MetricDetail` rendering metric detail row for categories specified above
- `MetricFunctionDetails` rendering metric details for sls functions, with date range and details organized by function triggers

## Web traffic

As it is now, web traffic is smoke and mirrors, with numbers being simulated by `reduxActions/metrics/simulateWebTraffic` action.
