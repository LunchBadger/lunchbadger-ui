export default class QuadrantComponent {
  _title = null;
  _component = null;
  _dataStore = null;
  _priority = null;
  _overwrite = false;

  constructor(title, component, dataStore, priority = 0, overwrite) {
    if (!title || !component || !dataStore) {
      throw new Error('When creating QuadrantComponent title, component and dataStore parameters are required');
    }

    this.title = title;
    this.component = component;
    this.dataStore = dataStore;
    this.priority = priority;
    this.overwrite = overwrite;
  }

  get title() {
    return this._title;
  }

  set title(title) {
    this._title = title;
  }

  get component() {
    return this._component;
  }

  set component(component) {
    this._component = component;
  }

  get dataStore() {
    return this._dataStore;
  }

  set dataStore(dataStore) {
    this._dataStore = dataStore;
  }

  get priority() {
    return this._priority;
  }

  set priority(priority) {
    this._priority = priority;
  }

  get overwrite() {
    return this._overwrite;
  }

  set overwrite(overwrite) {
    this._overwrite = overwrite;
  }
}
