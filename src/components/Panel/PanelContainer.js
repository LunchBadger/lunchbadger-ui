import React, {Component, PropTypes} from 'react';
import DetailsPanel from './DetailsPanel';
import MetricsPanel from './MetricsPanel';
import ForecastsPanel from './ForecastsPanel';

export default class PanelContainer extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired,
    canvas: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <DetailsPanel canvas={this.props.canvas}
                      container={this.props.container}/>
        <MetricsPanel canvas={this.props.canvas}
                      container={this.props.container}/>
        <ForecastsPanel canvas={this.props.canvas}
                        container={this.props.container}/>
      </div>
    );
  }
}
