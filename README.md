# LunchBadger UI

## Quick start

    # Run dev server
    npm start

    # Package a distribution
    npm run dist

    # Run headless tests, setting up the test environment via Docker
    npm run test

    # Run headless tests, but you have to set up your own environment (i.e.
    # configstore, lunchbadger, and dev server need to be running)
    npm run test:nodocker

    # Run tests in dev mode (will start browser on your machine)
    npm run test:dev

Tests run using [nightwatch.js](http://nightwatchjs.org/). Any arguments passed
to the `npm run test` command will be passed through to nightwatch. To specify
a test to run, for example:

    npm run test:dev -t test/specs/datasource/memory.js

## Deploy on staging:
- each bugfix/feature should be developed in a new branch
- a new branch should be forked from `master` and named in convention `[bugfix/feature]/[issue-number]-descriptive-task-title`
- after all needed changes are done and tested locally, commit and push
- in github create a new PR on this new branch, naming it with prefix `Bugfix/Feature ISSUE_NUMBER`
- PR can be pending on code review, but it should be already published on staging for tests, so:
- switch to `staging` branch
- merge your branch into `staging`
- open `src/index.html` and in 4 bottom lines increase `rnd` parameters
- open `src/index.js` and increate version in `console.log` line
- extend subarray below with new item, being PR name
- commit and push those 2 files with `ver` or `version bump` comment
- make sure, localhost still works fine, and check that staging http://staging.lunchbadger.com/ works fine (so new UI publish will not be a reason when it was already crashed)
- in a separate terminal tab, execute `npm run staging` - this will build a new staging (dev) version
- when finished, check http://staging.lunchbadger.com/ for your recent changes (when in doubts, check browser's console for version number and/or PR id's you put n steps 9-10), and reassign card for review and tests

## Deploy on prod
- it means, some new card(s) was already tested on staging and PRs has been code reviewed and merged to `master`
- if you're going to publish all recent cards merged to `master`, pull it
- switch to `prod` branch
- merge a brach(es), which you want to publish (just `master`, or separate bugfix/feature branches), into `prod`
- open `src/index.html` and in 4 bottom lines increase `rnd` parameters
- open `src/index.js` and increate version in `console.log` line
- extend subarray below with new item(s), being id of newly merged PR(s)
- commit and push those 2 files with `ver` or `version bump` comment
- make sure, localhost still works fine
- check that prod http://app.lunchbadger.com/ works fine (so new UI publish will not be a reason when it was already crashed)
- in a separate terminal tab, execute `npm run deploy` - this will build a new prod version and upload files into cloud
- when finished, do a smoke tests on prod http://app.lunchbadger.com/ that your newly published cards works fine (when in doubts, check browser's console for version number and/or PR id's you put n steps 6-7)

## Architecture

Build on `react` framework, with following major libraries:
- `redux` for state management
- `mobx` for state management of connections between entities
- `jsplumb` for visualizing connections between entities
- `axios` and `graphql-request` for handling api calls with backend
- `material-ui` for form input elements
- `formsy-react` for handling forms

### Plugins

Application business logic is divided into plugins located in the `plugins` directory:

- `lunchbadger-core` - main application engine - it provides redux, plugin store and UI elements library
- `lunchbadger-compose` - compose plugin providing API for managing data sources, models, sls functions and microservices
- `lunchbadger-manage` - manage plugin which adds options to manipulate gateways, service endpoints and api endpoints
- `lunchbadger-monetize` (future) - monetize plugin provides methods to create and manage APIs with plans and Portals
- `lunchbadger-monitor` (future) - plugin that adds monitor panel to track API usage
- `lunchbadger-optimize` (future) - plugin that adds panel to forecast future API usage

You can set which plugins should be installed during bundling container to main app in `cfg/info.json`

### Config and feature flags

Config is located in `src/config` for `dev` and `dist` (production). It contains:
- urls to all api endpoints
- `oauth` settings for authentication on prod with WordPress Ultimate Member plugin
- feature flags (booleans) for some functionalities, which can be displayed/hidden, depending on env (staging/production). For example, git access and uploading publick keys, may be turned on only for staging, and not production.
- other env dependent settings, for example sls functions types (node, python, go, java etc)

### UI elements library

Components located in `plugins/lunchbadger-core/src/ui` are components to serve atomic ui elements across entire app. Most of them are functional components.

### Services

Core and some plugins contains api services defined in `src/services`. For example:
- `core/src/services/ProjectService` - api handling project
- `compose/src/services/DataSourceService` - loopback workspace api handling datasource connectors
- `compose/src/services/ModelService` - loopback workspace api handling models
- `compose/src/services/SLSService` - api handling sls functions

### Redux

Reducers are defined in each plugin in `src/reducers` folder, and combined into single store by `core/src/utils/storeReducers` script.

Actions are defined in each plugin in `src/reduxActions`.

### Business login components

Business login components are defined in each plugin in `src/components`.

Core contains engine related components, about main app lifecycle, canvas, quadrants, canvas entities, header, aside tools menu, panels.

Each quadrant-related plugin contains components about specific entity type, dedicated form two view modes: on the canvas and zoom window.

### Entity models

Each quadrant-related plugin contains models defining specific entity type, inheriting from `core/src/models/BaseModel`. They expose common interface methods:
- `create` - deserializing data from backend api into models
- `toJSON` - serializing models into data to be send to backend api
- `toApiJSON` - same as above, but in case of sending data to express-gateway admin api
- `validate` - validating form data on submit
- `update` - on submit edit form data, after successful validation
- `remove` - on remove entity

### Plugs

Each plugin contains plugin specific settings extensions located in `src/plugs` folders. For example:
- `src/plugs/tools` - defines aside tool menu items
- `src/plugs/panelMenu` - defines header menu items
- `src/plugs/quadrants` - defines quadrants

## Read more

Core and each plugin is documented with more details:
- [core](./plugins/lunchbadger-core/src/README.md)
- [compose](./plugins/lunchbadger-compose/src/README.md)
- [manage](./plugins/lunchbadger-manage/src/README.md)
- [monetize](./plugins/lunchbadger-monetize/src/README.md)
- [monitor](./plugins/lunchbadger-monitor/src/README.md)
- [optimize](./plugins/lunchbadger-optimize/src/README.md)
