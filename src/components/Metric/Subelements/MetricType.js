import React, {Component, PropTypes} from 'react';
import {AND, OR, NOT} from 'models/MetricPair';
import classNames from 'classnames';
import './MetricType.scss';

export default class MetricType extends Component {
  static propTypes = {
    pair: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    const {pair} = this.props;
    const typeClass = classNames({
      'metric-type': true,
      'metric-type--and': pair.type === AND,
      'metric-type--not': pair.type === NOT,
      'metric-type--or': pair.type === OR
    });

    return (
      <div className={typeClass}>
        <figure className="metric-type__circles">
          <span className="metric-type__circle metric-type__circle--left"/>
          <span className="metric-type__circle metric-type__circle--right"/>
        </figure>
        <span className="metric-type__name">{this.props.pair.type}</span>
      </div>
    );
  }
}
