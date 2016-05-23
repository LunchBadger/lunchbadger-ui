const APIPlan = LunchBadgerMonetize.models.APIPlan;

export default class ForecastAPIPlan extends APIPlan {
  static type = 'ForecastAPIPlan';

  constructor(id, name, icon) {
    super(id);

    this.name = name;
    this.icon = icon;
  }
}
