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
    const parsedData = {};

    data.api.plans.forEach((plan) => {
      plan.details.forEach((detail) => {
        Object.keys(dataKeys).forEach((dataKey) => {
          if (!parsedData[detail.date]) {
            parsedData[detail.date] = {};
          }

          if (!parsedData[detail.date][dataKey]) {
            parsedData[detail.date][dataKey] = detail.subscribers[dataKey];
          } else {
            parsedData[detail.date][dataKey] += detail.subscribers[dataKey];
          }
        });
      });
    });

    debugger;

    return data.map((dataRow) => {
      dataRow.date = this._parseDate(dataRow.date);

      delete dataRow.id;

      Object.keys(dataKeys).forEach((dataKey) => {
        dataRow[dataKey] = +dataRow[dataKey];
      });

      return dataRow;
    });
  };

  _parseDate(date) {
    return d3.time.format('%m/%Y').parse(date);
  }
}

export default new ForecastDataParser();
