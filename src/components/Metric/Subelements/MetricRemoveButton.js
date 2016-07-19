import React, {Component, PropTypes} from 'react';
import remove from 'actions/Metrics/remove';
import './MetricRemoveButton.scss';

export default class MetricRemoveButton extends Component {
  static propTypes = {
    metric: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="metric-remove-button" onClick={() => {remove(this.props.metric)}}>
        <i className="fa fa-remove"/>
      </div>
    )
  }
}
