import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MetricType from './MetricType';
import './MetricHeader.scss';

export default class MetricHeader extends Component {
  static propTypes = {
    pair: PropTypes.object.isRequired,
    metricSelection: PropTypes.func,
    selectedPair: PropTypes.string
  };

  _handleMetricSelection = (pair) => {
    if (typeof this.props.metricSelection === 'function') {
      this.props.metricSelection(pair);
    }
  }

  render() {
    const {pair} = this.props;
    const {metricOne, metricTwo} = pair;

    return (
      <header className="metric-header">
        <div className="metric-header__title__name">
          <span className="metric-header__entity-name">{metricOne.entity.name}</span>
        </div>
        <div className="metric-header__title__type">
          {!!metricTwo && <MetricType isCurrentPair={this.props.selectedPair === this.props.pair.id}
                                      pair={pair}
                                      circlesClick={this._handleMetricSelection}/>}
        </div>
        <div className="metric-header__title__name">
          {!!metricTwo && <span className="metric-header__entity-name">{metricTwo.entity.name}</span>}
        </div>
      </header>
    );
  }
}
