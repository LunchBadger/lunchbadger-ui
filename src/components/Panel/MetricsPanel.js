import React, {Component} from 'react';

export const METRICS_PANEL = 'METRICS_PANEL';

class MetricsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = METRICS_PANEL;
  }

  render() {
    return (
      <div className="panel__body">
        <div className="panel__title">
          Metrics
        </div>
      </div>
    );
  }
}

export default LBCore.components.Panel(MetricsPanel);
