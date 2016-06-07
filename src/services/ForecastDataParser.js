import _ from 'lodash';
import moment from 'moment';

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
        detail.planId = plan.id;

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

  calculateMonthlyIncome(api, dateKey) {
    if (!dateKey) {
      return [];
    }

    const income = [];

    api.plans.forEach((plan) => {
      const planDetails = _.find(plan.details, (planDetails) => {
        return planDetails.date === dateKey;
      });

      if (!planDetails) {
        return [];
      }

      // check upgrades...
      const upgrades = plan.getPlanUpgradedUsers(dateKey, api, false);
      const existingFallByUpgrades = plan.getPlanDowngradedUsers(dateKey, api, false);

      // check downgrades
      const downgrades = plan.getPlanDowngradedUsers(dateKey, api, true);
      const existingRaiseByDowngrades = plan.getPlanUpgradedUsers(dateKey, api, true);

      let sum = 0;
      const {parameters, subscribers} = planDetails;
      const netSubscribers = subscribers.new + subscribers.upgrades + subscribers.existing + upgrades + existingRaiseByDowngrades;

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
          amount: sum * (subscribers.upgrades + upgrades) / netSubscribers,
          subscribers: subscribers.upgrades + upgrades
        },
        existing: {
          amount: sum * (subscribers.existing + existingRaiseByDowngrades - existingFallByUpgrades) / netSubscribers,
          subscribers: subscribers.existing + existingRaiseByDowngrades - existingFallByUpgrades
        },
        downgrades: {
          amount: sum * (subscribers.downgrades + downgrades) / netSubscribers,
          subscribers: subscribers.downgrades + downgrades
        },
        churn: {
          amount: sum * subscribers.churn / netSubscribers,
          subscribers: subscribers.churn
        }
      });
    });

    return income;
  }

  getUpgradesAndDowngrades(api, planId, date) {
    const plan = api.findPlan({id: planId});

    if (plan) {
      return {
        upgrades: plan.getPlanUpgradedUsers(date, api, false),
        downgrades: plan.getPlanDowngradedUsers(date, api, true),
        existing: plan.getPlanUpgradedUsers(date, api, true) - plan.getPlanDowngradedUsers(date, api, false)
      };
    }

    return {
      upgrades: 0,
      downgrades: 0,
      existing: 0
    }
  }

  filterData(range, data, api) {
    const filteredPlans = data.map((plan) => {
      return _.filter(plan, (planDetails) => {
        return moment(planDetails.date).isBetween(range.startDate, range.endDate, 'month', '[]');
      });
    });

    return filteredPlans.map((plan) => {
      const planDetails = {};

      plan.forEach((planProperties) => {
        const dateKey = `${planProperties.date.getMonth() + 1}/${planProperties.date.getFullYear()}`;
        const changes = this.getUpgradesAndDowngrades(api, planProperties.planId, dateKey);

        // dirty hack, need to be fixed
        planProperties.subscribers.upgrades += parseInt(changes.upgrades / 4, 10);
        planProperties.subscribers.downgrades += parseInt(changes.downgrades / 4, 10);
        planProperties.subscribers.existing += parseInt(changes.existing / 4, 10);

        planDetails[dateKey] = planProperties;
      });

      return planDetails;
    });
  }
}

export default new ForecastDataParser();
