import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {remove} from '../../../reduxActions/metrics';
import './MetricRemoveButton.scss';

export default class MetricRemoveButton extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  handleRemove = () => {
    const {store: {dispatch}} = this.context;
    dispatch(remove(this.props.metric));
  }

  render() {
    return (
      <div className="metric-remove-button" onClick={this.handleRemove}>
        <i className="fa fa-remove"/>
      </div>
    )
  }
}
