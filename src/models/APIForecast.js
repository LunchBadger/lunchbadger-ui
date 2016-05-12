const BaseModel = LunchBadgerCore.models.BaseModel;

export default class APIForecast extends BaseModel {
  static type = 'APIForecast';

  /**
   * @type {Endpoint[]}
   * @private
   */

  constructor(id, name, apiId, left, top) {
    super(id);

    this.name = name;
    this.apiId = apiId;
    this.left = left;
    this.top = top;
  }
}
