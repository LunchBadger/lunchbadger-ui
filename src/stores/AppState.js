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
    }
  }
}

export default new AppState();
