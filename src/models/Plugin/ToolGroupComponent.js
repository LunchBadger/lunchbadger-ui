export default class ToolGroupComponent {
  _component = null;
  _priority = null;

	/**
   * @type {ToolComponent[]}
   * @private
   */
  _tools = [];

  constructor(component, tools, priority = 0) {
    this.component = component;
    this.tools = tools;
    this.priority = priority;
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

  get priority() {
    return this._priority;
  }

  set priority(priority) {
    this._priority = priority;
  }
}
