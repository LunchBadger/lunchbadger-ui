export default class PanelButtonComponent {
  _icon = null;
  _panelKey = null;

  constructor(icon, panelKey) {
    this.icon = icon;
    this.panelKey = panelKey;
  }

  get icon() {
    return this._icon;
  }

  set icon(icon) {
    this._icon = icon;
  }

  get panelKey() {
    return this._panelKey;
  }

  set panelKey(panelKey) {
    this._panelKey = panelKey;
  }
}
