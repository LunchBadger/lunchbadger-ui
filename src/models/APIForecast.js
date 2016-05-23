const BaseModel = LunchBadgerCore.models.BaseModel;

export default class APIForecast extends BaseModel {
  static type = 'APIForecast';

	/**
   * @type {ForecastAPI}
   * @private
   */
  _api = null;

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

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      api: this.api.toJSON()
    }
  }

	/**
   * @param api {ForecastAPI}
   */
  set api(api) {
    this._api = api;
  }

	/**
   * @returns {ForecastAPI}
   */
  get api() {
    return this._api;
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
