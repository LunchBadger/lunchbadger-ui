const BaseModel = LunchBadgerCore.models.BaseModel;

export default class APIForecast extends BaseModel {
  static type = 'APIForecast';

	/**
   * @type {Upgrade[]}
   * @private
   */
  _upgrades = [];

  constructor(id, name, api, left, top) {
    super(id);

    this.name = name;
    this.api = api;
    this.left = left;
    this.top = top;

    this.upgrades = [];
  }

  /**
   * @param upgrades {Upgrade[]}
   */
  set upgrades(upgrades) {
    this._upgrades = upgrades;
  }

  /**
   * @returns {Upgrade[]}
   */
  get upgrades() {
    return this._upgrades;
  }

  /**
   * @param upgrade {Upgrade}
   */
  addUpgrade(upgrade) {
    this._upgrades.push(upgrade);
  }
}
