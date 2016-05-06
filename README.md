## LunchBadger Container app

It mixes core and plugins to produce final application

* `plugins/` - directory for core module and each plugin

## Development

Clone container repository. After that go to plugin directory and clone required plugins:
* `lunch-badger-core` - core for whole application - it provides dispatcher and plugin registry
* `lunch-badger-plugin-base` - base plugin providing canvas and basic elements for drawing

Other plugins can be installed just by using git clone (they need to reside inside `plugins` directory)

Important thing while building: 

* open `cfg/dev` file and find config entry to select which plugins should be bundled:

``` 
 entry: {
    start: [
      'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
      'webpack/hot/only-dev-server',
      './src/index'
    ],
    core: './plugins/lunch-badger-core/index',
    plugins: [
      './plugins/lunch-badger-plugin-monitor/index',
      './plugins/lunch-badger-plugin-base/index'
      
      // here you can type which plugins should be bundled to final release
    ]
  },
```

Same thing should be done with `cfg/dist` file to provide proper config for dist builds
