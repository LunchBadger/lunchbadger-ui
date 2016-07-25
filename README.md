# LunchBadger Core

Core required for development
Just put core inside `plugins/` directory of container to start development

Core module provides reusable components for rest of the modules.
Also this is the source for other plugins to register (it provides Plugin store).

## Installation
Simply run `npm install` inside the main catalog.
This command will create symbolic link to node_modules directory from container so modules are not duplicated.

## Generator
It uses `generator-react-webpack` so you can use `yo react-webpack:component my/namespaced/components/name` command to generate new component for React

## Usage
```
# Start for development
npm start

# Just build the dist version and copy static files
npm run dist

# Make dist build with local configuration file
npm run dist:local

# Run unit tests
npm test

# Lint all files in src (also automatically done AFTER tests are run)
npm run lint
```

## Creating plugins
As mentioned previously, plugins were build using `generator-react-webpack`. 
Simplest way to create new plugin is to use yeoman `yo react-webpack` and create new plugin.

Also - you can use some of other plugins, just clone plugin code, remove everything from `./src` directory
to get empty plugin. Two changes are also required - in `./cfg/base.js` change plugin name and library name:

```
output: {
  path: path.join(__dirname, '/../dist'),
  filename: 'core.js', // here change the plugin file output name
  libraryTarget: 'umd',
  library: 'LunchBadgerCore', // here change the library name which will be exposed globally
  publicPath: `.${defaultSettings.publicPath}`
},
```

Second change is required in `./index.js` - there you need to set proper plugin file name `require('./dist/core');`

Then you can simply start developing plugin. 

####Important!
**Entry file for every plugin should be placed in `./src/index.js`.**
This file is used to expose global public API and to register plugin.

### Registering plugins
To register plugin you need to get proper action from core
```
LunchBadgerCore.actions.registerPlugin(/* pass plugin object here */);
```

To create plugin object, create plugin file, for example in `./src/plugs`.
Then you need to get Plugin model from core and pass a name as argument: 
```
const plugin = new LunchBadgerCore.models.Plugin(/* pass plugin name here */);
```

Plugin is created, just export it now to use it in registerPlugin action
```
export default plugin;
```

### Plugin components
Plugin can be extended by several components, which have been described below.

#### Tools and tool groups
Tools are components that allow you to add new entities. 
They are placed on left panel. They can be connected into groups. Each of the group is divided from others by border.

Registering new tool is pretty simple. 
First, you need to create ToolGroup which can be taken from core:
```
const toolGroupComponent = LunchBadgerCore.components.ToolGroup;
```

After that, create array of tools:
```
const tools = [
  new LunchBadgerCore.models.ToolComponent(/* Tool component */),
  new LunchBadgerCore.models.ToolComponent(/* Tool component */)
];
```

Each tool uses React Tool component which can be also taken from core.
Examples of existing tools can be found in manage, compose or monetize plugins.

Example of Tool component:

```
import React, {Component} from 'react';

const Tool = LunchBadgerCore.components.Tool;

class MyTool extends Component {
  render() {
    return (
      <div className="tool" onClick={() => alert('test')}>
      	<i className="tool__icon"/>
      	<span className="tool__tooltip">My Tool</span>
      </div>
    );
  }
}

export default Tool(MyTool);
```

When your Tool components are ready, add them to Tool group:
```
const toolGroups = [
  new LunchBadgerCore.models.ToolGroupComponent(/* group name */, toolGroupComponent, tools, 2)
];
```

Arguments are - group name, group component imported from core, array of tools and priority.
Tool groups are ordered by priority - groups with higher priority are placed lower on left panel.

Each plugin can handle multiple tool groups, which can be passed as array of tool groups.
Finally, to register tool group inside plugin simply run:
```
plugin.registerToolGroup(toolGroups);
```

#### Panels
Developers have possibility to add custom panels that slides down from the top.
To register new panel simply use `registerPanel` on created plugin object.

As arguments you must pass 
```
plugin.registerPanel(/* panel button object */, /* panel object */, /* priority */);
```

Panel button model is placed inside a core, to create a panel button object simply use:
```
const panelButton = new LunchBadgerCore.models.PanelButtonComponent(/* icon class */, /* panel key */);
```

Arguments are icon class - string which will be added to panel button component (allows to set proper icon) and
panel key - this is important because button will toggle panel that matches proper panel key.

To create panel object use PanelComponent - also placed in core:
```
const panel = new LunchBadgerCore.models.PanelComponent(/* Panel Component */);
```

As argument you have to pass React Panel Component. Example panel components can be found in monitor and optimize plugins at `./src/components/Panel` directory.

Last argument in registerPanel method is priority, which will tell about panel button position - higher -> move to right.

#### Details panel editor
Details panel allow user to edit specific details of entity when it is highlighted on canvas.
Each detail panel is detected by entity type. To create and register details panel simply create array of PanelDetailsComponent (grab it from core):

```
const detailsPanels = [
  new LunchBadgerCore.models.PanelDetailsComponent(/* Entity type */, /* Details Component */),
  new LunchBadgerCore.models.PanelDetailsComponent(/* Entity type */, /* Details Component */)
];
```

The arguments are entity type (string!, f.e.: 'Gateway' or Gateway.type) and PanelDetails React Component.
Example details component can be found in `plugins/lunchbadger-manage/src/components/Panel/EntitiesDetails/`.

To register details panel use core action:
```
plugin.registerDetailsPanels(detailsPanels);
```

#### Quadrants
Quadrants are components where entities are being rendered.
Registering quadrant is easy action.

First, you need to create array which will hold QuadrantComponent models.

```
const quadrants = [
  new LunchBadgerCore.models.QuadrantComponent('Private', /* Quadrant Component */, /* Store */, 1),
];
```

Arguments are - quadrant name, React Quadrant Component, Flux data Store which holds quadrant entities, priority.
Higher priority -> quadrant goes to right.

Finally, register quadrants in plugin:
```
plugin.registerQuadrants(quadrants);
```

#### Connection strategies
Connection strategies allow developer to create specific strategy when connection between entities is created or moved.
When strategy will be found and fulfilled, it will run proper action.

To create and register new strategy first get the Strategy model from core:
```
const Strategy = LunchBadgerCore.models.Strategy;
```

After that, create new strategy and pass two arguments to constructor:
```
const customStrategy = new Strategy(/* check action */, /* fulfilled action */);
```

Check action is a method that should return true, false or null.
* If returns null - strategy is simply skipped. 
* If returns false - check fails and fulfill action won't be called.
* If returns true - fulfilled action will be run.

As arguments, when checking connection strategy you will receive connection info (jsPlumb object) and jsPlumb canvas instance.

As fulfilled action callback you can pass whatever you want, it can be for example Flux action, but remember that fulfilled action will receive same arguments as check action.

After creating proper strategy, simply use two plugin methods to register strategies:
```
plugin.registerOnConnectionCreatedStrategy(customStrategyOne);
plugin.registerOnConnectionMovedStrategy(customStrategyTwo);
```
