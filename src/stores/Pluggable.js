import BaseStore from './BaseStore';
import _ from 'lodash';

/**
 * @type {Plugin[]}
 */
const plugins = [];

class Pluggable extends BaseStore {
  constructor() {
    super();

    this.subscribe(() => this._registerEvents.bind(this));
  }

  _registerEvents(action) {
    switch (action.type) {
      case 'RegisterPlugin':
        this.registerPlugin(action.plugin);
        this.emitChange();
        break;
    }
  }

  /**
   * @param plugin {Plugin}
   */
  registerPlugin(plugin) {
    plugins.push(plugin);
  }

  /**
   * @returns {Plugin[]}
   */
  getPlugins() {
    return plugins;
  }

  getPanels() {
    return _.filter(plugins, (plugin) => {
      return plugin.panel;
    });
  }

  getPanelButtons() {
    const pluginsWithPanelButton = _.filter(plugins, (plugin) => {
      return plugin.panelButton;
    });

    return _.sortBy(pluginsWithPanelButton, (plugin) => {
      return plugin.panelPriority;
    });
  }

  getToolGroups() {
    const pluginsWithToolGroups = _.filter(plugins, (plugin) => {
      return plugin.toolGroup;
    });

    return _.sortBy(pluginsWithToolGroups, (plugin) => {
      return plugin.toolGroupPriority;
    });
  }

  getQuadrants() {
    const pluginsWithQuadrants = _.filter(plugins, (plugin) => {
      return plugin.quadrants && plugin.quadrants.length;
    });

    // merge quadrants
    const reducedQuadrants = pluginsWithQuadrants.reduce((quadrants, plugin) => {
      return quadrants.concat(plugin.quadrants);
    }, []);

    return _.sortBy(reducedQuadrants, (quadrant) => {
      return quadrant.priority;
    });
  }
}

export default new Pluggable();
