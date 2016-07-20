import React, {Component, PropTypes} from 'react';
import './MetricType.scss';

export default class MetricType extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="metric-type metric-type--and">
        <figure className="metric-type__circles">
          <span className="metric-type__circle metric-type__circle--left" />
          <span className="metric-type__circle metric-type__circle--right" />
        </figure>
        <span className="metric-type__name">AND</span>
      </div>
    );
  }
}
