import React, {Component, PropTypes} from 'react';
import MetricDetail from './MetricDetail';
import {SUM, AVG} from 'models/MetricDetail';
import classNames from 'classnames';
import addDetailToMetric from 'actions/Metrics/addDetailToMetric';
import './MetricDetails.scss';

export default class MetricDetails extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false
    };
  }

  renderDetails() {
    return this.props.metric.details.map((detail) => {
      return <MetricDetail detail={detail} key={detail.id}/>;
    });
  }

  _handleNewDetail(title, type) {
    addDetailToMetric(this.props.metric, title, type);
    this.setState({showTooltip: false});
  }

  render() {
    const tooltipClass = classNames({
      'metric-details__tooltip': true,
      'metric-details__tooltip--visible': this.state.showTooltip
    });

    return (
      <div className="metric-details">
        <div className="metric-details__header">
          <div className="metric-details__header__title">Metrics</div>
          <div className="metric-details__header__action">
            <i className="fa fa-plus metric-details__header__action__button"
               onClick={() => this.setState({showTooltip: !this.state.showTooltip})}>
            </i>

            <ul className={tooltipClass} onMouseLeave={() => this.setState({showTooltip: false})}>
              <li className="metric-details__tooltip__option"
                  onClick={() => this._handleNewDetail('Total Apps', SUM)}>
                Total Apps
              </li>
              <li className="metric-details__tooltip__option"
                  onClick={() => this._handleNewDetail('Total Users', AVG)}>
                Total Users
              </li>
              <li className="metric-details__tooltip__option"
                  onClick={() => this._handleNewDetail('Total API Portals', SUM)}>
                Total API Portals
              </li>
              <li className="metric-details__tooltip__option"
                  onClick={() => this._handleNewDetail('Total Requests', AVG)}>
                Total Requests
              </li>
            </ul>
          </div>
        </div>
        <div className="metric-details__list">
          {this.renderDetails()}
        </div>
      </div>
    );
  }
}
