# Manage plugin

Manage plugin serves:
- service endpoints for Private quadrant
- gateways for Gateway quadrant
- api endpoints for Public quadrant
- connections between those entities

## Service Endpoint

ServiceEndpoint is defined by:
- `models/ServiceEndpoint` model
- `reducers/serviceEndpoints` redux reducer
- `reduxActions/serviceEndpoints` redux actions
- `components/CanvasElements/ServiceEndpoint` component displayed on the canvas
- `components/EntitiesDetails/ServiceEndpointDetails` component displayed in the zoom window

ServiceEndpoint components initially displays predefined urls defined in `utils/initialServiceEndpointUrls`.

ServiceEndpoint model has defined `out` port, with following triggered actions:
- `plugs/onConnectionCreateStrategy` - when user connect ServiceEndpoint with Pipeline
- `plugs/onConnectionMovedStrategy` - when user re-connect ServiceEndpoint and Pipeline
- `plugs/onConnectionDeletedStrategy` - when user disconnect ServiceEndpoint with Pipeline

## API Endpoint

ApiEndpoint is defined by:
- `models/ApiEndpoint` model
- `reducers/apiEndpoints` redux reducer
- `reduxActions/apiEndpoints` redux actions
- `components/CanvasElements/ApiEndpoint` component displayed on the canvas
- `components/EntitiesDetails/ApiEndpointDetails` component displayed in the zoom window

ApiEndpoint model has defined `in` port, with following triggered actions:
- `plugs/onConnectionCreateStrategy` - when user connect ApiEndpoint with Pipeline
- `plugs/onConnectionMovedStrategy` - when user re-connect ApiEndpoint and Pipeline
- `plugs/onConnectionDeletedStrategy` - when user disconnect ApiEndpoint with Pipeline

## Gateway

Gateway is defined by:
- `models/Gateway` model
- `reducers/gateways` redux reducer
- `reduxActions/gateways` redux actions
- `services/ExpressGatewayAdminService` api services
- `components/CanvasElements/Gateway` component displayed on the canvas
- `components/EntitiesDetails/GatewayDetails` component displayed in the zoom window

Gateway components initially displays pipeline with predefined policies defined in `utils/initialPipelinePolicies`.

Gateway zoom window view is rendered using composition of following components from `components/EntitiesDetails/Subelements/` folder:
- `GatewayPolicyCAPair` - Condition/Action wrapper box
- `GatewayPolicyCondition` - Policy Condition box
- `GatewayPolicyAction` - Policy Action box
- `GatewayProxyServiceEndpoint` - serviceEndpoint input used in proxy policy
- `CustomerManagement` - Customer Management tab content

Each gateway pipeline has defined `in` and `out` ports, with following triggered actions:
- `plugs/onConnectionCreateStrategy` - when user connect Pipeline with ServiceEndpoint, Model, SLS Function or ApiEndpoint
- `plugs/onConnectionMovedStrategy` - when user re-connect Pipeline and ServiceEndpoint, Model, SLS Function or ApiEndpoint
- `plugs/onConnectionDeletedStrategy` - when user disconnect Pipeline with ServiceEndpoint, Model, SLS Function or ApiEndpoint

### Express Gateway policies schema

Any express gateway instance exposes policies schema via admin api `/schemas` endpoint.

However, as it is now, schemas are hardcoded in the manage plugin `src/gatewaySchemasMock`, and anytime, they change on eg side, they should be synced also in this file.

#### Options for future improvements
- replace hardcoded schemas with fetching them in real time from backend, ie. from some internal eg instance, or CDN
- refactor hand-made solution to visualize schema for with open-source, ie. `react-jsonschema-form-semanticui`, still keeping current loon'n'feel

#### How it works?

Raw schema json located in `src/gatewaySchemasMock` is transformed by `src/utils/transformGatewaySchemas` script (ie. to add metadata that `expression` properties should be displayed as js code editor) and passed to components located in `src/components/Panel/EntitiesDetails/Subelements` folder:
- `GatewayPolicyCondition` - renders policy condition part
- `GatewayPolicyAction` - renders policy action part

Both components visualize schema, property by property, using recursive algorithm (in case of any deep down level of object properties). Each property is rendered as Core/UI generic `EntityProperty` component with appropriate props, to display different types of fields (string, number, select for enums, checkbox for booleans etc).

Note: As it is now, not all json-schema.org specification is implemented, for example usage of `allOf`, `oneOf`.

#### Reusability

`GatewayPolicyAction` component with local schema definition, is used also in other app areas:
- datasource properties in compose plugin
- model remote methods in compose plugin
- consumer management of gateway
