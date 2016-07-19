import React, {Component, PropTypes} from 'react';
import MetricDetail from './MetricDetail';
import './MetricDetails.scss';

export default class MetricDetails extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderDetails() {
    return this.props.metric.details.map((detail) => {
      return <MetricDetail detail={detail} key={detail.id} />;
    });
  }

  render() {
    return (
      <div className="metric-details">
        <div className="metric-details__header">
          <div className="metric-details__header__title">Metrics</div>
          <div className="metric-details__header__action">
            <i className="fa fa-plus metric-details__header__action__button"/>
          </div>
        </div>
        <div className="metric-details__list">
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}
