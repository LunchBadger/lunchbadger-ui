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
      return plugin.toolGroups;
    });

    // merge groups
    const reducedToolGroups = pluginsWithToolGroups.reduce((toolGroups, plugin) => {
      return toolGroups.concat(plugin.toolGroups);
    }, []);

    return _.sortBy(reducedToolGroups, (plugin) => {
      return plugin.priority;
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

    const quadrants = _.uniqWith(reducedQuadrants.reverse(), (currentQuadrant, otherQuadrant) => {
      return (currentQuadrant.priority === otherQuadrant.priority && otherQuadrant.overwrite);
    });

    return _.sortBy(quadrants, (quadrant) => {
      return quadrant.priority;
    });
  }

  getDetailsPanel(type) {
    const pluginsWithPanelDetails = _.filter(plugins, (plugin) => {
      return plugin.panelDetails && plugin.panelDetails.length;
    });

    // merge detail panels
    const reducedPanelDetails = pluginsWithPanelDetails.reduce((panelsWithDetails, plugin) => {
      return panelsWithDetails.concat(plugin.panelDetails);
    }, []);

    return _.filter(reducedPanelDetails, (detailsPanel) => {
      return detailsPanel.type === type;
    });
  }

  getConnectionCreatedStrategies() {
    return _.filter(plugins, (plugin) => {
      return plugin.handleConnectionCreated;
    });
  }

  getConnectionMovedStrategies() {
    return _.filter(plugins, (plugin) => {
      return plugin.handleConnectionMoved;
    });
  }
}

export default new Pluggable();
