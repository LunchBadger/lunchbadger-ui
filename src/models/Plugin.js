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
   * @type {ToolGroupComponent[]|null}
   * @private
   */
  _toolGroups = null;

	/**
   * @type {QuadrantComponent[]|null}
   * @private
   */
  _quadrants = null;

	/**
   * @type {PanelDetailsComponent[]|null}
   * @private
   */
  _panelDetails = null;

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

  get toolGroups() {
    return this._toolGroups;
  }

  get panelPriority() {
    return this._panelPriority;
  }

  get quadrants() {
    return this._quadrants;
  }

  get panelDetails() {
    return this._panelDetails;
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
   * @param toolGroups {ToolGroupComponent[]}
   */
  registerToolGroup(toolGroups) {
    this._toolGroups = toolGroups;
  }

	/**
   * @param quadrants {QuadrantComponent[]}
   */
  registerQuadrants(quadrants) {
    this._quadrants = quadrants;
  }

	/**
   * @param panelDetails {PanelDetailsComponent[]}
   */
  registerDetailsPanels(panelDetails) {
    this._panelDetails = panelDetails;
  }
}
