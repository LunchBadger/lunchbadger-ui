## LunchBadger UI

![Build status](https://circleci.com/gh/LunchBadger/lunchbadger-ui.svg?style=shield&circle-token=86cb8d9912528010b54ed16844810098887c48b6)

### Plugins

Plugins are located in the `plugins` directory.

* `lunchbadger-core` - core for whole application - it provides dispatcher and plugin store
* `lunchbadger-compose` - compose plugin providing API for managing data sources and models
* `lunchbadger-manage` - manage plugin which adds options to manipulate gateways and endpoints
* `lunchbadger-monetize` - monetize plugin provides methods to create and manage APIs and plans
* `lunchbadger-monitor` - plugin that adds monitor panel to track API usage
* `lunchbadger-optimize` - plugin that adds panel to forecast future API usage

## Quick start

    # Run dev server
    npm start

    # Run storybook on dev server (library of UI components)
    npm run storybook

    # Build a distribution of storybook into /.out folder
    npm run storybook:build

    # Deploy storybook on GitHub pages: https://lunchbadger.github.io
    npm run storybook:deploy

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

To set up a dev/test environment prior to running the above commands, perform
the following steps:

1. Check out [configstore](../../../../LunchBadger/configstore). This server will serve the
   project data.

  * `npm install`.
  * `npm start`

2. Check out [lunchbadger](../../../../LunchBadger/lunchbadger). This server will serve the
   forecast data.

  * `npm install`
  * `npm start`

### Important thing while building:

You can set which plugins should be installed during bundling container to main app in `cfg/info.json`
