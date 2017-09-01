import ForecastAPI from './ForecastAPI';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class APIForecast extends BaseModel {
  static type = 'APIForecast';

  /**
   * @type {ForecastAPI}
   * @private
   */
  _api = null;

  constructor(id, api, left, top) {
    super(id);
    this.api = api;
    this.left = left;
    this.top = top;
    this.upgrades = [];
  }

  recreate() {
    return APIForecast.create(this);
  }

  toJSON() {
    return {
      id: this.id,
      api: this.api.toJSON()
    }
  }

  /**
   * @param api {ForecastAPI}
   */
  set api(api) {
    if (!api) {
      this._api = ForecastAPI.create({});
      return;
    }

    if (api.constructor.type === ForecastAPI.type) {
      this._api = api;
      return;
    }
    /*
      FIXME - when real APIForecast (not mock) will be returned from backend,
      replace code below with:
        this._api = ForecastAPI.create(api);
    */
    const mockApi = ForecastAPI.create(api);
    const id = this._api.id;
    mockApi.id = id;
    mockApi.name = this._api.name;
    this.id = id;
    this._api = mockApi;
  }

  /**
   * @returns {ForecastAPI}
   */
  get api() {
    return this._api;
  }
}
