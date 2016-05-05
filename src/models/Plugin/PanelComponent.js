export default class PanelComponent {
  _component = null;

  constructor(component) {
    this.component = component;
  }

  get component() {
    return this._component;
  }

  set component(component) {
    this._component = component;
  }
}
