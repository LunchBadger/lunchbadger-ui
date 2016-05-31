import _ from 'lodash';

const APIPlan = LunchBadgerMonetize.models.APIPlan;

export default class ForecastAPIPlan extends APIPlan {
  static type = 'ForecastAPIPlan';

  constructor(id, name, icon) {
    super(id);

    this.name = name;
    this.icon = icon;
  }

	/**
   * @param details {PlanDetails}
   */
  addPlanDetails(details) {
    this.details.push(details);
  }

	/**
   * @param date {moment}
   * @returns {Array}
   */
  checkPlanDetailsExistence(date) {
    return _.filter(this.details, (detail) => {
      return detail.date === date.format('M/YYYY');
    }).length;
  }
}
