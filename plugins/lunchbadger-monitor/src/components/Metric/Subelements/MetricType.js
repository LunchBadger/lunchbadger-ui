import React, {Component, PropTypes} from 'react';
import {AND, OR, NOT} from '../../../models/MetricPair';
import classNames from 'classnames';
import './MetricType.scss';

export default class MetricType extends Component {
  static propTypes = {
    pair: PropTypes.object.isRequired,
    circlesClick: PropTypes.func,
    isCurrentPair: PropTypes.bool
  };

  constructor(props) {
    super(props);
  }

  _handleCirclesClick = () => {
    if (typeof this.props.circlesClick === 'function') {
      this.props.circlesClick(
        (this.props.isCurrentPair) ? null : this.props.pair
      );
    }
  }

  render() {
    const {pair} = this.props;
    const typeClass = classNames({
      'metric-type': true,
      'metric-type--current': this.props.isCurrentPair,
      'metric-type--and': pair.type === AND,
      'metric-type--not': pair.type === NOT,
      'metric-type--or': pair.type === OR
    });

    return (
      <div className={typeClass} onClick={this._handleCirclesClick}>
        <figure className="metric-type__circles">
          <span className="metric-type__circle metric-type__circle--left"/>
          <span className="metric-type__circle metric-type__circle--right"/>
        </figure>
        <span className="metric-type__name">{this.props.pair.type}</span>
      </div>
    );
  }
}
