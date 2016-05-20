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
        const {date} = detail;
        detail.date = this.parseDate(date);

        planDetails[date] = detail;
      });

      parsedData.push(planDetails);
    });

    return parsedData;
  };

  parseDate(date) {
    return d3.time.format('%m/%Y').parse(date);
  }
}

export default new ForecastDataParser();
