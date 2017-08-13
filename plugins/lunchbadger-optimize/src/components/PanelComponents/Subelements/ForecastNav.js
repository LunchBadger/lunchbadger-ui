import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {removeAPIForecast} from '../../../reduxActions/forecasts';

export default class ForecastNav extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired,
    onExpand: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  remove = () => {
    const {onClose, entity} = this.props;
    onClose();
    this.context.store.dispatch(removeAPIForecast(entity.id));
  }

  toggleExpand = () => this.props.onExpand();

  render() {
    return (
      <ul className="api-forecast__header__nav">
        <li>
          <a onClick={this.remove}>
            <i className="fa fa-remove"/>
          </a>
        </li>
        <li>
          <a onClick={this.toggleExpand}>
            <i className="icon-icon-resize"/>
          </a>
        </li>
      </ul>
    );
  }
}
