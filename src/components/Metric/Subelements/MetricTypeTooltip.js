import React, {Component, PropTypes} from 'react';
import {AND, OR, NOT} from 'models/MetricPair';
import changeType from 'actions/Metrics/changeType';
import './MetricTypeTooltip.scss';

export default class MetricTypeTooltip extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired,
    pairId: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  _handleChange(selection) {
    changeType(this.props.metric, this.props.pairId, selection);

    if (typeof this.props.onChange === 'function') {
      this.props.onChange(selection);
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
