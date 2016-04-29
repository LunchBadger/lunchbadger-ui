export default class Plugin {
  _name = null;

	/**
   * @type {PanelButtonComponent|null}
   * @private
   */
  _panelButton = null;

	/**
   * @type {PanelComponent|null}
   * @private
   */
  _panel = null;

	/**
   * @type {ToolComponent|null}
   * @private
   */
  _tool = null;

  _toolPriority = 0;
  _panelPriority = 0;

  constructor(name) {
    this.name = name;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get panel() {
    return this._panel;
  }

  get panelButton() {
    return this._panelButton;
  }

  get tool() {
    return this._tool;
  }

  get panelPriority() {
    return this._panelPriority;
  }

  get toolPriority() {
    return this._toolPriority;
  }

	/**
   * @param panelButtonComponent {PanelButtonComponent}
   * @param panelComponent {PanelComponent}
   * @param panelButtonPriority {Number}
   */
  registerPanel(panelButtonComponent, panelComponent, panelButtonPriority = 0) {
    if (!panelButtonComponent || !panelComponent) {
      throw new Error('Both panel button and panel must be registered at same time');
    }

    this._panel = panelComponent;
    this._panelButton = panelButtonComponent;
    this._panelPriority = panelButtonPriority;
  }

	/**
   * @param toolComponent {ToolComponent}
   * @param toolPriority {Number}
   */
  registerTool(toolComponent, toolPriority = 0) {
    this._tool = toolComponent;
    this._toolPriority = toolPriority;
  }

  renderPanelButton() {
    if (this._panelButton) {
      return this._panelButton;
    }
  }

  renderPanel() {
    if (this._panel) {
      return this._panel;
    }
  }

  renderTool() {
    if (this._tool) {
      return this._tool;
    }
  }
}
