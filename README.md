## LunchBadger Container app

It mixes core and plugins to produce final application

* `plugins/` - directory for core module and each plugin

## Quick start

  # First, install all dependencies
  npm install

  # Now clone and build each repo
  cd plugins
  for plugin in core compose manage monetize monitor optimize; do
    git clone git@github.com:LunchBadger/lunchbadger-${plugin}.git
    pushd lunchbadger-${plugin}
    npm install
    npm run dist
    popd
  done

  # Run dev server
  npm start

  # Package a distribution
  npm run dist

## Development

Clone container repository. After that go to plugin directory and clone required plugins:
* `lunchbadger-core` - core for whole application - it provides dispatcher and plugin store
* `lunchbadger-compose` - compose plugin providing API for managing data sources and models
* `lunchbadger-manage` - manage plugin which adds options to manipulate gateways and endpoints
* `lunchbadger-monetize` - monetize plugin provides methods to create and manage APIs and plans
* `lunchbadger-monitor` - plugin that adds monitor panel to track API usage
* `lunchbadger-optimize` - plugin that adds panel to forecast future API usage

###Important thing while building: 

You can set which plugins should be installed during bundling container to main app
There are two places where you can set list of plugins that should be installed:

* if using client app from **lunchbadger** repository, list of plugins can be found at **./server/info.json** file
* if using separate container, list of plugins can be set in **./bin/info.json** file
