export default class PanelDetailsComponent {
  _component = null;
  _type = null;

  constructor(type, component) {
    this.type = type;
    this.component = component;
  }

  get component() {
    return this._component;
  }

  set component(component) {
    this._component = component;
  }
  
  get type() {
    return this._type;
  }
  
  set type(type) {
    this._type = type;
  }
}
