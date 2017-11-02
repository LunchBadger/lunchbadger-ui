import React, {PureComponent} from 'react';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import numeral from 'numeral';
import moment from 'moment';
import '../Metric.scss';
import './MetricDetails.scss';
import './MetricDetail.scss';

const getRandom = (start, range) => start + Math.floor(range * Math.random());

@inject('connectionsStore') @observer
class MetricFunctionDetails extends PureComponent {
  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      triggers: [],
    };
  }

  componentDidMount() {
    const {id, connectionsStore} = this.props;
    const state = this.context.store.getState();
    const triggers = [];
    const connsTo = connectionsStore.search({toId: id});
    connsTo.forEach((conn) => {
      triggers.push({
        type: 'dataSource',
        source: state.entities.dataSources[conn.fromId].name,
        invocations: getRandom(20000, 200000),
        avgDuration: getRandom(400, 1000),
        errors: getRandom(20, 1200),
      });
    });
    const connsFrom = connectionsStore.search({fromId: id});
    connsFrom.forEach((conn) => {
      const connsApiEndpoints = connectionsStore.search({fromId: conn.toId});
      connsApiEndpoints.forEach((connAE) => {
        triggers.push({
          type: 'apiEndpoint',
          source: state.entities.apiEndpoints[connAE.toId].name,
          invocations: getRandom(20000, 200000),
          avgDuration: getRandom(400, 1000),
          errors: getRandom(20, 1200),
        });
      });
    });
    this.setState({triggers});
    this.interval = setInterval(this.simulateWebTraffic, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  simulateWebTraffic = () => {
    const triggers = [...this.state.triggers];
    triggers.forEach((_, idx) => {
      triggers[idx].invocations += getRandom(0, 30);
      triggers[idx].avgDuration += getRandom(-5, 11);
      if (Math.random() >= 0.7) {
        triggers[idx].errors += getRandom(0, 10);
      }
    });
    this.setState({triggers});
  }

  render() {
    const {triggers} = this.state;
    return (
      <div className="metric__details function">
        <div className="metric-details__header">
          <div className="metric-details__header__title">Metrics</div>
        </div>
        <div className="metric-detail-daterange">
          <span className="metric-detail__date">{moment().subtract(1, 'months').format('DD MMM YYYY')}</span>
          <span className="metric-detail__date-between">to</span>
          <span className="metric-detail__date">{moment().format('DD MMM YYYY')}</span>
        </div>
        <div className="metric-details__list">
          <div className="metric-detail">
            <div className="metric-detail__cell">
              Trigger
            </div>
            <div className="metric-detail__cell">
              Invocations
            </div>
            <div className="metric-detail__cell">
              Avg. duration
            </div>
            <div className="metric-detail__cell">
              Errors
            </div>
          </div>
          {triggers.map(({source, invocations, avgDuration, errors}, idx) => (
            <div key={idx} className="metric-detail">
              <div className="metric-detail__cell">
                {source}
              </div>
              <div className="metric-detail__cell metric-detail__value">
                {numeral(invocations).format('0,0')}
              </div>
              <div className="metric-detail__cell metric-detail__value">
                {numeral(avgDuration).format('0,0')} ms
              </div>
              <div className="metric-detail__cell metric-detail__value">
                {numeral(errors).format('0,0')}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default MetricFunctionDetails;
