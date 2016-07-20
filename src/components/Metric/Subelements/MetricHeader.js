import React, {Component, PropTypes} from 'react';
import MetricType from './MetricType';
import './MetricHeader.scss';

export default class MetricHeader extends Component {
  static propTypes = {
    pair: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
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
          {!!metricTwo && <MetricType pair={pair}/>}
        </div>
        <div className="metric-header__title__name">
          {!!metricTwo && <span className="metric-header__entity-name">{metricTwo.entity.name}</span>}
        </div>
      </header>
    );
  }
}
