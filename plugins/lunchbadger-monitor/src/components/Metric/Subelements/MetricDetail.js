import React, {Component, PropTypes} from 'react';
import './MetricDetail.scss';
import {APPS, PORTALS, USERS, REQUESTS} from '../../../models/MetricDetail';
import numeral from 'numeral';
import moment from 'moment';

export default class MetricDetail extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired,
    detail: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  getDetailTitle(key) {
    switch(key) {
      case APPS:
        return 'Total Apps';
      case PORTALS:
        return 'Total API Portals';
      case USERS:
        return 'Total Users';
      case REQUESTS:
        return 'Total Requests';
      default:
        return 'Total';
    }
  }

  render() {
    const {metric, detail} = this.props;
    const detailTitle = this.getDetailTitle(detail);
    const summary = metric.getDetailsSummary();

    return (
      <div className="metric-detail">
        <div className="metric-detail__cell">
          <span className="metric-detail__title">{detailTitle}</span>
        </div>
        <div className="metric-detail__cell">
          <span className="metric-detail__date">{moment().subtract(1, 'months').format('DD MMM YYYY')}</span>
          <span className="metric-detail__date-between">to</span>
          <span className="metric-detail__date">{moment().format('DD MMM YYYY')}</span>
        </div>
        <div className="metric-detail__cell">
          {
            (detail === APPS || detail === USERS) && <span className="metric-detail__symbol">Σ</span>
          }

          {
            (detail === PORTALS || detail === REQUESTS) && <span className="metric-detail__symbol metric-detail__symbol--avg">χ</span>
          }
        </div>
        <div className="metric-detail__cell metric-detail__value">
          {numeral(summary[detail]).format('0,0')}
        </div>
      </div>
    );
  }
}
