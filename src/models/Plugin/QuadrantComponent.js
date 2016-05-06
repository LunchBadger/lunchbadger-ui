export default class QuadrantComponent {
  _title = null;
  _component = null;
  _dataStore = null;
  _priority = null;

  constructor(title, component, dataStore, priority = 0) {
    if (!title || !component || !dataStore) {
      throw new Error('When creating QuadrantComponent title, component and dataStore parameters are required');
    }
    
    this.title = title;
    this.component = component;
    this.dataStore = dataStore;
    this.priority = priority;
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
}
