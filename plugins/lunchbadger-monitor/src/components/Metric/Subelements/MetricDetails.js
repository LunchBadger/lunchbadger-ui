import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MetricDetail from './MetricDetail';
import {USERS, REQUESTS, APPS, PORTALS} from '../../../models/MetricDetail';
import classNames from 'classnames';
import './MetricDetails.scss';

export default class MetricDetails extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      showTooltip: false,
      visibleDetails: [USERS, REQUESTS]
    };
  }

  renderDetails() {
    return this.state.visibleDetails.map((detail, index) => {
      return <MetricDetail key={index} detail={detail} metric={this.props.metric}/>;
    });
  }

  _toggleDetailVisibility(key) {
    let visibleDetails = this.state.visibleDetails.slice();
    const keyIndex = visibleDetails.findIndex(detail => detail === key);

    if (keyIndex > -1) {
      visibleDetails.splice(keyIndex, 1);
    } else {
      visibleDetails.push(key);
    }

    this.setState({
      visibleDetails: visibleDetails,
      showTooltip: false
    });
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
                  onClick={() => {
                    this._toggleDetailVisibility(APPS);
                  }}
              >
                Total Apps
              </li>
              <li className="metric-details__tooltip__option"
                  onClick={() => {
                    this._toggleDetailVisibility(USERS);
                  }}
              >
                Total Users
              </li>
              <li className="metric-details__tooltip__option"
                  onClick={() => {
                    this._toggleDetailVisibility(PORTALS);
                  }}
              >
                Total API Portals
              </li>
              <li className="metric-details__tooltip__option"
                  onClick={() => {
                    this._toggleDetailVisibility(REQUESTS);
                  }}
              >
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
