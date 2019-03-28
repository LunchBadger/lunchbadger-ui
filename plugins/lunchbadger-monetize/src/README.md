# Monetize plugin (future)

Monetize plugin serves:
- apis for Public quadrant
- portals for Public quadrant
- connections between those entities

## API

API is defined by:
- `models/API` model
- `reducers/apis` redux reducer
- `reduxActions/apis` redux actions
- `components/CanvasElements/API` component displayed on the canvas
- `components/EntitiesDetails/APIDetails` component displayed in the zoom window

API is rendered using composite components defined by in `components/CanvasElements/Subelements` folder:
- `ApiEndpoint` - bundled ApiEndpoints to API
- `Plan` - for API plans

As it is now, API doesn't provide any functionality other, then bundling ApiEndpoints and displaying 3 plans: Free, Developer and Professional.

## Portal

Portal is defined by:
- `models/Portal` model
- `reducers/portals` redux reducer
- `reduxActions/portals` redux actions
- `components/CanvasElements/Portal` component displayed on the canvas

Portal is rendered using composite components defined in `components/CanvasElements/Subelements/` folder:
- `API` - bundled APIs to Portal
- `SubApiEndpoint` - bundled ApiEndpoints bundled to APIs bundled to Portal

As it is now, Portal doesn't provide any functionality other, then bundling APIs.
