# Core

Core serves:
- app main runtime
- canvas with quadrants and entities placed by matching type
- aside menu with:
  - icons served by plugins to add new entities to the canvas
  - widget to zoom-in/out entities on the canvas
- header having app logo and menu with icons to:
  - save and clear project
  - open settings panel
  - redirect to documentation website
  - logout user
  - other icons served by plugins
- library of ui elements
- redux state for app engine
- services for project api, config store, kube watcher and ssh manager

## App main runtime

App main runtime starts as `components/App/AppLoader` component. Component itself renders loader spinner with `Please wait. Baking workspace` message. In the background, for given logged in user, config store producer is called to scaffold user's workspace (if not scaffolded yet). This step may be optional, depending on enableConfigStoreApi config flag.

Depending on the producers response, error box is rendered on failure, or `components/App/App` on success, with app header, aside menu, canvas and all other app elements.

## Project lifecycle

### Initial loading data

Initially, all data from backend are requested by `reduxActions/project/loadFromServer` action, and stored in dedicated reducers, defined individually by each plugin.

### Saving project

On each auto-save (triggered by saving changes of edited entities), or whenever click `Save project` header icon, all data to be saved are collected from plugins reducers, and sent to backend by `reduxActions/project/saveToServer` action.

### Clearing project

Whenever click `Clear project` header icon, a backend request to clear project is called by `reduxActions/project/clearServer` action.

### Silent project reload

App supports working on the same project with more, then one user at the same time. When user opens entity for editing (via quick edit or zoom window), that entity is displayed as locked (small lock icon) to other users. This is possible by
`reduxActions/project/silentReload` action.

### Logout

Whenever click `Logout` header icon, a backend request to clear project is called by `reduxActions/project/logout` action.

## Canvas

Canvas is rendered by `components/Canvas/Canvas` component. It's main functionality is to provide experience of connecting entities by their ports. For this purpose, `jsPlumb` library is used (called `paper` in code), and following events are defined:
- `connection` - when new connection is made by user
- `connectionDetached` - when existing connection is removed by user
- `beforeDrop` - action called before user drop connection on end port
- `beforeDrag` - action called before user drag connection on begin port
- `connectionAborted` - action called when user abandon connecting ports
- `click` - action called when user click on connection (if it is delete icon, connection is removed)

## Quadrant

Quadrant is rendered by:
- `components/Quadrant/QuadrantContainer` component. It's main responsibility is to provide functionality of horizontally resizing quadrants
- `components/Quadrant/Quadrant` component. It's main responsibilities are:
  - to trigger actions, when items are re-ordered in the quadrant
  - to auto-scroll quadrant, when user is during connecting posrts, and reaches top/bottom part of the quadrant

## Header

Header is rendered by `components/Header/Header` component. It's main functionality is to displays menu icons, defined by core and plugins.

## Library of UI elements

Library of UI elements is stored in `ui` folder. It contains all common ui components, used across the app. Major generic ui elements are:
- `Button`, `IconButton`, `IconMenu`, `Table`, `Form` - ui interface elements
- `Entity` - entity box, with header, content, toolbox menu
- `Resizable` and `RnD` - box components with functionalities of resizable and drag&drop
- `SystemDefcon1` - error box
- `FilesEditor` - files editor (wrapper around AceEditor)
- `Sortable` - wrapper providing functionality to re-order items on the list
