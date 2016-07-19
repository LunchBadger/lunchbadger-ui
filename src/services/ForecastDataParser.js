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

      // check downgrades...
      const downgrades = plan.getPlanDowngradedUsers(dateKey, api, true);
      const existingRaiseByDowngrades = plan.getPlanUpgradedUsers(dateKey, api, true);

      // check new...
      const newUsers = plan.getPlanNewUsers(dateKey, api);

      // check churn...
      const churnUsers = plan.getPlanChurnUsers(dateKey, api);

      debugger;

      let sum = 0;
      const {parameters, subscribers} = planDetails;
      const netSubscribers = subscribers.new + subscribers.upgrades + subscribers.existing + upgrades + existingRaiseByDowngrades + newUsers - churnUsers;

      plan.tiers.forEach((tier) => {
        const monthlyDetails = _.find(tier.details, (tierDetails) => {
          return tierDetails.date === dateKey;
        });

        if (!monthlyDetails) {
          return;
        }

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
          amount: sum * (subscribers.new + newUsers) / netSubscribers || 0,
          subscribers: subscribers.new + newUsers
        },
        upgrades: {
          amount: sum * (subscribers.upgrades + upgrades) / netSubscribers || 0,
          subscribers: subscribers.upgrades + upgrades
        },
        existing: {
          amount: sum * (subscribers.existing + existingRaiseByDowngrades - existingFallByUpgrades) / netSubscribers || 0,
          subscribers: subscribers.existing + existingRaiseByDowngrades - existingFallByUpgrades
        },
        downgrades: {
          amount: sum * (subscribers.downgrades + downgrades) / netSubscribers || 0,
          subscribers: subscribers.downgrades + downgrades
        },
        churn: {
          amount: sum * (subscribers.churn + churnUsers) / netSubscribers || 0,
          subscribers: subscribers.churn + churnUsers
        }
      });
    });

    return income;
  }

  getUpgradesAndDowngrades(api, planId, date) {
    const plan = api.findPlan({id: planId});

    if (plan) {
      return {
        new: plan.getPlanNewUsers(date, api),
        churn: plan.getPlanChurnUsers(date, api),
        upgrades: plan.getPlanUpgradedUsers(date, api, false),
        downgrades: plan.getPlanDowngradedUsers(date, api, true),
        existing: plan.getPlanUpgradedUsers(date, api, true) - plan.getPlanDowngradedUsers(date, api, false)
      };
    }

    return {
      new: 0,
      churn: 0,
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
        const {subscribers} = planProperties;

        planDetails[dateKey] = Object.assign({}, planProperties, {
          subscribers: {
            new: subscribers.new + changes.new,
            churn: subscribers.churn + changes.churn,
            upgrades: subscribers.upgrades + changes.upgrades,
            downgrades: subscribers.downgrades + changes.downgrades,
            existing: subscribers.existing + changes.existing
          }
        });
      });

      return planDetails;
    });
  }
}

export default new ForecastDataParser();
