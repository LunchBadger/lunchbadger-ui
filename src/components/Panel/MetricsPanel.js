import React, {Component} from 'react';
import Panel from './Panel';
import panelKeys from 'constants/panelKeys';

class MetricsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.METRICS_PANEL;
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

export default Panel(MetricsPanel);
