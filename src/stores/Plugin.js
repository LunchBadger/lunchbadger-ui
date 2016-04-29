import BaseStore from './BaseStore';

const plugins = [];

class Plugin extends BaseStore {
  constructor() {
    super();
  }

  registerPlugin(plugin) {
    plugin.push(plugin);
  }

  getPlugins() {
    return plugins;
  }
}

export default new Plugin();
