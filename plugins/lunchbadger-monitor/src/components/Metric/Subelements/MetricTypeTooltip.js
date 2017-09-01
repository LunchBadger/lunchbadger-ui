import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {AND, OR, NOT} from '../../../models/MetricPair';
import {changeType} from '../../../reduxActions/metrics';
import './MetricTypeTooltip.scss';

export default class MetricTypeTooltip extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired,
    pairId: PropTypes.string,
    onChange: PropTypes.func
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  _handleChange(selection) {
    const {metric, pairId, onChange} = this.props;
    const {store: {dispatch}} = this.context;
    dispatch(changeType(metric, pairId, selection));
    if (typeof onChange === 'function') {
      onChange(selection);
    }
  }

  render() {
    return (
      <ul className="metric-type-tooltip">
        <li className="metric-type-tooltip__option" onClick={() => this._handleChange(OR)}>
          <div className="metric-type-tooltip__option__type metric-type-tooltip__option__type--or">
            <figure className="metric-type-tooltip__circles">
              <span className="metric-type-tooltip__circle metric-type-tooltip__circle--left"/>
              <span className="metric-type-tooltip__circle metric-type-tooltip__circle--right"/>
            </figure>
          </div>

          OR
        </li>
        <li className="metric-type-tooltip__option" onClick={() => this._handleChange(AND)}>
          <div className="metric-type-tooltip__option__type metric-type-tooltip__option__type--and">
            <figure className="metric-type-tooltip__circles">
              <span className="metric-type-tooltip__circle metric-type-tooltip__circle--left"/>
              <span className="metric-type-tooltip__circle metric-type-tooltip__circle--right"/>
            </figure>
          </div>

          AND
        </li>
        <li className="metric-type-tooltip__option" onClick={() => this._handleChange(NOT)}>
          <div className="metric-type-tooltip__option__type metric-type-tooltip__option__type--not">
            <figure className="metric-type-tooltip__circles">
              <span className="metric-type-tooltip__circle metric-type-tooltip__circle--left"/>
              <span className="metric-type-tooltip__circle metric-type-tooltip__circle--right"/>
            </figure>
          </div>

          NOT
        </li>
      </ul>
    );
  }
}
