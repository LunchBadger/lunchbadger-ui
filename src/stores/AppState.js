import BaseStore from './BaseStore';

const state = {};

class AppState extends BaseStore {
  constructor() {
    super();

    this.subscribe(() => this._registerActions.bind(this));
  }

  setStateKey(key, value) {
    state[key] = value;
    this.emitChange();
  }

  getStateKey(key) {
    return state[key];
  }

  _registerActions(action) {
    switch (action.type) {
      case 'AddElement':
        this.setStateKey('recentElement', action.element);
        break;

      case 'TogglePanel':
        const currentPanel = this.getStateKey('currentlyOpenedPanel');
        let panel = action.panelKey;

        if (currentPanel === panel) {
          panel = null;
        }

        this.setStateKey('currentlyOpenedPanel', panel);
        this.emitChange();

        setTimeout(() => {
          this.setStateKey('isPanelOpened', panel ? true : false);
          this.emitChange();
        });
        
        break;

      case 'ToggleHighlight':
        this.setStateKey('currentElement', action.element);
        this.emitChange();
        break;
    }
  }
}

export default new AppState();
