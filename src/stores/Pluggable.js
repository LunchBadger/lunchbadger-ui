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
    }).reverse();
  }

  getTools() {
    const pluginsWithTool = _.filter(plugins, (plugin) => {
      return plugin.tool;
    });

    return _.sortBy(pluginsWithTool, (plugin) => {
      return plugin.toolPriority;
    }).reverse();
  }
}

export default new Pluggable();
