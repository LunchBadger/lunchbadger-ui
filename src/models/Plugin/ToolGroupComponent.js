export default class ToolGroupComponent {
  _component = null;

	/**
   * @type {ToolComponent[]}
   * @private
   */
  _tools = [];

  constructor(component, tools) {
    this.component = component;
    this.tools = tools;
  }

  get component() {
    return this._component;
  }

  set component(component) {
    this._component = component;
  }

  get tools() {
    return this._tools;
  }

  set tools(tools) {
    this._tools = tools;
  }
}
