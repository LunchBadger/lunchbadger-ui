import _ from 'lodash';

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
  }

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

  calculateMonthlyIncome(plans, dateKey) {
    if (!dateKey) {
      return [];
    }

    const income = [];

    plans.forEach((plan) => {
      const planDetails = _.find(plan.details, (planDetails) => {
        return planDetails.date === dateKey;
      });

      if (!planDetails) {
        return [];
      }

      let sum = 0;
      const {parameters, subscribers} = planDetails;
      const netSubscribers = subscribers.new + subscribers.upgrades + subscribers.existing;

      plan.tiers.forEach((tier) => {
        const monthlyDetails = _.find(tier.details, (tierDetails) => {
          return tierDetails.date === dateKey;
        });

        const {type, conditionFrom, conditionTo, value} = monthlyDetails;
        const totalCalls = parameters.callsPerSubscriber * netSubscribers;

        switch (type) {
          case 'fixed':
            if (conditionFrom === 1 && conditionTo > 0) {
              sum += conditionTo * value;
            } else if (conditionFrom > 1 && conditionTo === 0) {
              sum += (totalCalls - (conditionFrom - 1)) * value;
            } else if (conditionFrom > 1 && conditionTo > 0) {
              sum += (conditionTo - conditionFrom - 1) * value;
            }

            break;
          case 'percentage':
            sum += parameters.cashPerCall * totalCalls * value / 100;

            break;
        }
      });

      income.push({
        new: {
          amount: sum * subscribers.new / netSubscribers,
          subscribers: subscribers.new
        },
        upgrades: {
          amount: sum * subscribers.upgrades / netSubscribers,
          subscribers: subscribers.upgrades
        },
        existing: {
          amount: sum * subscribers.existing / netSubscribers,
          subscribers: subscribers.existing
        },
        downgrades: {
          amount: sum * subscribers.downgrades / netSubscribers,
          subscribers: subscribers.downgrades
        },
        churn: {
          amount: sum * subscribers.churn / netSubscribers,
          subscribers: subscribers.churn
        }
      });
    });

    return income;
  }
}

export default new ForecastDataParser();
