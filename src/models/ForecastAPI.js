import ForecastAPIPlan from './ForecastAPIPlan';

const BaseModel = LunchBadgerCore.models.BaseModel;

export default class ForecastAPI extends BaseModel {
  static type = 'ForecastAPI';

  /**
   * @type {ForecastAPIPlan[]}
   * @private
   */
  _plans = [];

  constructor(id, name) {
    super(id);

    this.name = name;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      plans: this.plans.map(plan => plan.toJSON())
    }
  }

  /**
   * @param plans {ForecastAPIPlan[]}
   */
  set plans(plans) {
    this._plans = plans.map((plan) => {
      if (plan.constructor.type === ForecastAPIPlan.type) {
        return plan;
      }

      return ForecastAPIPlan.create(plan);
    });
  }

  /**
   * @returns {ForecastAPIPlan[]}
   */
  get plans() {
    return this._plans;
  }
}
