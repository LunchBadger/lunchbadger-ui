import React, {Component, PropTypes} from 'react';
import numeral from 'numeral';

export default class ForecastDetailsBottom extends Component {
  static propTypes = {
    incomeSummary: PropTypes.array,
    selectedDate: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])
  };

  constructor(props) {
    super(props);

    this.state = {
      summary: {
        new: {
          sum: 0,
          users: 0
        },
        upgrades: {
          sum: 0,
          users: 0
        },
        existing: {
          sum: 0,
          users: 0
        },
        downgrades: {
          sum: 0,
          users: 0
        },
        churn: {
          sum: 0,
          users: 0
        }
      },
      month: null,
      year: null
    };
  }

  componentDidMount() {
    this._setDate(this.props.selectedDate);
    this._calculateSummaries(this.props.incomeSummary);
  }

  componentWillReceiveProps(nextProps) {
    this._setDate(nextProps.selectedDate);
    this._calculateSummaries(nextProps.incomeSummary);
  }

  _setDate(date) {
    const partialDate = date.split('/');
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    this.setState({
      year: partialDate[1],
      month: monthNames[partialDate[0] - 1]
    });
  }

  _calculateSummaries(incomeSummary) {
    const summary = Object.assign({}, this.state.summary);

    incomeSummary.forEach((planSummary) => {
      Object.keys(this.state.summary).forEach((summaryKey) => {
        summary[summaryKey] = {
          sum: summary[summaryKey].sum + planSummary[summaryKey].amount,
          users: summary[summaryKey].users + planSummary[summaryKey].subscribers
        }
      });
    });

    this.setState({summary: summary});
  }

  render() {
    return (
      <div className="forecast__details-bottom">
        <div className="forecast__details-bottom__date">
          {this.state.month}<br />
          {this.state.year}
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--new">
          <span className="forecast__details-bottom__detail__title">
            {numeral(this.state.summary.new.users).format('0,0')} new users
          </span>
          <span className="forecast__details-bottom__detail__value">
            {numeral(this.state.summary.new.sum).format('$0.0a')}
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--upgrades">
          <span className="forecast__details-bottom__detail__title">
            {numeral(this.state.summary.upgrades.users).format('0,0')} upgrades
          </span>
          <span className="forecast__details-bottom__detail__value">
            {numeral(this.state.summary.upgrades.sum).format('$0.0a')}
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--existing">
          <span className="forecast__details-bottom__detail__title">
            {numeral(this.state.summary.existing.users).format('0,0')} existing
          </span>
          <span className="forecast__details-bottom__detail__value">
            {numeral(this.state.summary.existing.sum).format('$0.0a')}
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--downgrades">
          <span className="forecast__details-bottom__detail__title">
            {numeral(this.state.summary.downgrades.users).format('0,0')} downgrades
          </span>
          <span className="forecast__details-bottom__detail__value">
            -{numeral(this.state.summary.downgrades.sum).format('$0.0a')}
          </span>
        </div>
        <div className="forecast__details-bottom__detail forecast__details-bottom__detail--churn">
          <span className="forecast__details-bottom__detail__title">
            {numeral(this.state.summary.churn.users).format('0,0')} churn
          </span>
          <span className="forecast__details-bottom__detail__value">
            -{numeral(this.state.summary.churn.sum).format('$0.0a')}
          </span>
        </div>
      </div>
    );
  }
}
