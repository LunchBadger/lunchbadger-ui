const APIPlan = LunchBadgerMonetize.models.APIPlan;

export default class ForecastAPIPlan extends APIPlan {
  static type = 'ForecastAPIPlan';

  _values = [];

  constructor(id, name, icon, tiers, values) {
    super(id);

    this.name = name;
    this.icon = icon;
    this.tiers = tiers;
    this.values = values;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      icon: this.icon,
      tiers: this.tiers.map((tier) => {
        return tier.toJSON()
      }),
      values: this.values
    }
  }

  set values(values) {
    this._values = values;
  }

  get values() {
    return this._values;
  }
}
