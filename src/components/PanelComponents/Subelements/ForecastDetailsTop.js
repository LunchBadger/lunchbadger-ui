import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';
import _ from 'lodash';

export default class ForecastDetailsTop extends Component {
  static propTypes = {
    selectedDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]),
    data: PropTypes.array,
    incomeSummary: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      statistics: {}
    };
  }

  componentDidMount() {
    this._onUpdate(this.props.selectedDate, this.props.data, this.props.incomeSummary);
  }

  componentWillReceiveProps(nextProps) {
    this._onUpdate(nextProps.selectedDate, nextProps.data, nextProps.incomeSummary);
  }

  _onUpdate(selectedDate, data, incomeSummary) {
    const summary = this._recalculateSummary(selectedDate, data);

    summary['avgPerUser'] = this._calculateSummaries(incomeSummary);

    this.setState({statistics: summary});
  }

  _recalculateSummary(selectedDate, data) {
    const summary = {
      annualRecurring: 0,
      monthlyRecurring: 0,
      retention: 0,
      payingUsers: 0,
      totalUsers: 0
    };
    const statistics = this._recalculateStatisticsPerPlanPerMonth(data);

    // get all months
    let months = [];

    statistics.forEach((statistic) => {
      months = months.concat(Object.keys(statistic));
    });

    if (months.length < 1) {
      return [];
    }

    months = _.sortBy(_.uniq(months), (month) => parseInt(month));

    months.forEach((month) => {
      statistics.forEach((statistic) => {
        if (!statistic[month]) {
          return;
        }

        summary['annualRecurring'] += statistic[month]['recurring'];

        if (selectedDate === month || (!selectedDate && this.state.currentDate === month)) {
          summary['monthlyRecurring'] += statistic[month]['recurring'];
          summary['payingUsers'] += statistic[month]['payingUsers'];
          summary['totalUsers'] += statistic[month]['totalUsers'];
          summary['retention'] += statistic[month]['retention'];
        }
      });
    });

    summary['retention'] = summary['retention'] / statistics.length;

    return summary;
  }

  _recalculateStatisticsPerPlanPerMonth(data) {
    const statistics = [];

    data.forEach((plan) => {
      const planStatistics = {};

      Object.keys(plan).forEach((dateKey) => {
        const details = plan[dateKey];
        const {parameters, subscribers} = details;
        let payingUsersInMonth = 0;

        if (!planStatistics[dateKey]) {
          planStatistics[dateKey] = {};
        }

        // users calculation
        const usersInMonth = subscribers.existing + subscribers.new + subscribers.upgrades - subscribers.downgrades - subscribers.churn;
        const retention = 1 - ((subscribers.downgrades + subscribers.churn) / subscribers.existing);

        if (parameters.cashPerCall > 0) {
          payingUsersInMonth = usersInMonth;
        }

        // revenue calculation
        const monthlyRecurring = parameters.cashPerCall * (parameters.callsPerSubscriber * payingUsersInMonth);

        planStatistics[dateKey]['recurring'] = monthlyRecurring;
        planStatistics[dateKey]['retention'] = retention;
        planStatistics[dateKey]['payingUsers'] = payingUsersInMonth;
        planStatistics[dateKey]['totalUsers'] = usersInMonth;
      });

      statistics.push(planStatistics);
    });

    return statistics;
  }

  _calculateSummaries(incomeSummary) {
    let sum = 0;
    let users = 0;

    incomeSummary.forEach((planSummary) => {
      sum += planSummary['existing'].amount + planSummary['new'].amount + planSummary['upgrades'].amount;
      users += planSummary['existing'].subscribers + planSummary['new'].subscribers + planSummary['upgrades'].subscribers;
    });

    if (users > 0) {
      return sum / users;
    }

    return 0;
  }

  render() {
    if (Object.keys(this.state.statistics).length < 1) {
      return null;
    }

    const {statistics} = this.state;

    return (
      <div className="forecast__details-top">
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Annual recurring
          </span>
          <span className="forecast__details-top__detail__value">
            {numeral(statistics.annualRecurring).format('$0,0')}
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Monthly recurring
          </span>
          <span className="forecast__details-top__detail__value">
            {numeral(statistics.monthlyRecurring).format('$0,0')}
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Avg per user
          </span>
          <span className="forecast__details-top__detail__value">
            {numeral(statistics.avgPerUser).format('$0,0.00')}
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Monthly retention
          </span>
          <span className="forecast__details-top__detail__value">
            {numeral(statistics.retention).format('0.00%')}
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Paying users
          </span>
          <span className="forecast__details-top__detail__value">
            {numeral(statistics.payingUsers).format('0,0')}
          </span>
        </div>
        <div className="forecast__details-top__detail">
          <span className="forecast__details-top__detail__title">
            Total users
          </span>
          <span className="forecast__details-top__detail__value">
            {numeral(statistics.totalUsers).format('0,0')}
          </span>
        </div>
      </div>
    );
  }
}
