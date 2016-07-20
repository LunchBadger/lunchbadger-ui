import React, {Component, PropTypes} from 'react';
import './MetricDetail.scss';
import {SUM, AVG} from 'models/MetricDetail';
import numeral from 'numeral';

export default class MetricDetail extends Component {
  static propTypes = {
    detail: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {detail} = this.props;

    return (
      <div className="metric-detail">
        <div className="metric-detail__cell">
          <span className="metric-detail__title">{detail.title}</span>
        </div>
        <div className="metric-detail__cell">
          <span className="metric-detail__date">{detail.dateFrom.format('DD MMM YYYY')}</span>
          <span className="metric-detail__date-between">to</span>
          <span className="metric-detail__date">{detail.dateTo.format('DD MMM YYYY')}</span>
        </div>
        <div className="metric-detail__cell">
          {
            detail.type === SUM && <span className="metric-detail__symbol">Σ</span>
          }

          {
            detail.type === AVG && <span className="metric-detail__symbol metric-detail__symbol--avg">χ</span>
          }
        </div>
        <div className="metric-detail__cell metric-detail__value">
          {numeral(detail.value).format('0,0')}
        </div>
      </div>
    );
  }
}
