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
   * @type {ToolGroupComponent|null}
   * @private
   */
  _toolGroup = null;

	/**
   * @type {QuadrantComponent[]|null}
   * @private
   */
  _quadrants = null;

  _toolGroupPriority = 0;
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

  get toolGroup() {
    return this._toolGroup;
  }

  get panelPriority() {
    return this._panelPriority;
  }

  get toolGroupPriority() {
    return this._toolGroupPriority;
  }

  get quadrants() {
    return this._quadrants;
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
   * @param toolGroupComponent {ToolGroupComponent}
   * @param toolGroupPriority {Number}
   */
  registerToolGroup(toolGroupComponent, toolGroupPriority = 0) {
    this._toolGroup = toolGroupComponent;
    this._toolGroupPriority = toolGroupPriority;
  }

	/**
   * @param quadrants[] {QuadrantComponent}
   */
  registerQuadrants(quadrants) {
    this._quadrants = quadrants;
  }
}
