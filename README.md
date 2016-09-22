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

    # Package a distribution
    npm run dist

###Important thing while building: 

You can set which plugins should be installed during bundling container to main app in `cfg/info.json`
