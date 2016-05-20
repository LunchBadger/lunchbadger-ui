export const dataKeys = {
  churn: '-',
  downgrades: '-',
  existing: '+',
  upgrades: '+',
  new: '+'
};

class ForecastDataParser {
  constructor() {
  }

  prepareData(data) {
    const parsedData = [];

    // there is potential spot for map/reduce pattern..
    data.api.plans.forEach((plan) => {
      const planDetails = {};

      plan.details.forEach((detail) => {
        const dateKey = this._checkDateKey(detail.date);
        detail.date = this.parseDate(dateKey);

        planDetails[dateKey] = detail;
      });

      parsedData.push(planDetails);
    });

    return parsedData;
  };

  parseDate(date) {
    if (date instanceof Date) {
      return date;
    }

    return d3.time.format('%m/%Y').parse(date);
  }

  _checkDateKey(dateKey) {
    if (dateKey instanceof Date) {
      return `${dateKey.getMonth() + 1}/${dateKey.getFullYear()}`;
    }

    return dateKey;
  }
}

export default new ForecastDataParser();
