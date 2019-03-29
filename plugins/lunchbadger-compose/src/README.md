# Compose plugin

Compose plugin serves:
- datasources (model connectors) for Backend quadrant
- models, sls functions and microservices (future) for Private quadrant
- connections between those entities
- api explorer for models

## DataSource

DataSource (model connector) is defined by:
- `models/DataSource` model
- `reducers/dataSources` redux reducer
- `reduxActions/dataSources` redux actions
- `services/DataSourceService` api service
- `components/CanvasElements/DataSource` component displayed on the canvas
- `components/EntitiesDetails/DataSourceDetails` component displayed in the zoom window

Datasource components display editing form based on schemas defined for each datasource type in `utils/dataSourceSchemas`. In case of `rest` datasource, predefined configs are defined in `utils/predefinedRests`.

DataSource model has defined one `out` port, with following triggered actions:
- `plugs/onConnectionCreateStrategy` - when user connect DataSource with Model
- `plugs/onConnectionMovedStrategy` - when user re-connect DataSource and Model
- `plugs/onConnectionDeletedStrategy` - when user disconnect DataSource with Model

Whenever workspace loopback crashes because of wrong datasource settings (not reachable host, invalid credentials etc), error message is parsed and bind with specific entity responsible for this error. It's done by `utils/catchDatasourceErrors` script.

## Model

Model is defined by:
- `models/Model` model
- `reducers/models` redux reducer
- `reduxActions/models` redux actions
- `services/ModelService`, `services/ModelConfigsService` and `services/WorkspaceFilesService` api services
- `components/CanvasElements/Model` component displayed on the canvas
- `components/EntitiesDetails/ModelDetails` component displayed in the zoom window

When editing models name, it is auto-transformed to fulfill loopback model name restrictions, with use of `utils/getModelJsFilename` and `utils/validModelName` scripts.

Model model has defined `in` and `out` ports, with following triggered actions:
- `plugs/onConnectionCreateStrategy` - when user connect DataSource with Model
- `plugs/onConnectionMovedStrategy` - when user re-connect DataSource and Model
- `plugs/onConnectionDeletedStrategy` - when user disconnect DataSource with Model

Whenever model is edited and changed, an Api Explorer is auto-refreshed. It's done by `utils/reloadApiExplorer` script.

## SLS Function

SLS Function is defined by:
- `models/Function` model
- `reducers/functions` redux reducer
- `reduxActions/functions` redux actions
- `services/SLSService` api service
- `components/CanvasElements/Function` component displayed on the canvas
- `components/EntitiesDetails/FunctionDetails` component displayed in the zoom window

When editing sls function name, it is validated to fulfill sls function name restrictions, with use of `utils/validFunctionName` script.

Function has defined `in` and `out` port, with following triggered actions:
- `plugs/onConnectionCreateStrategy` - when user connect Function with Model or DataSource
- `plugs/onConnectionMovedStrategy` - when user re-connect Function with DataSource or Model
- `plugs/onConnectionDeletedStrategy` - when user disconnect Function with DataSource or Model

## Microservice

Microservice is defined by:
- `models/Microservice` model
- `reducers/microservices` redux reducer
- `reduxActions/microservices` redux actions
- `components/CanvasElements/Microservice` component displayed on the canvas (no zoom window mode).

As it is now, microservice serves as virtual container for models bundled to them, defined in `reducers/modelsBundled` redux.

## Api Explorer

Api Explorer is defined by:
- `plugs/panelMenu` plug to display Api Explorer icon in the header menu
- `services/ApiExplorerService` api service
- `components/Panel/ApiExplorerPanel` component displayed in the opened panel
