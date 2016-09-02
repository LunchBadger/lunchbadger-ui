## LunchBadger Container app

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

You can set which plugins should be installed during bundling container to main app
There are two places where you can set list of plugins that should be installed:

* if using client app from **lunchbadger** repository, list of plugins can be found at **./server/info.json** file
* if using separate container, list of plugins can be set in **./cfg/info.json** file
