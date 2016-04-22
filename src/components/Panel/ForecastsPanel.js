import React, {Component} from 'react';
import Panel from './Panel';
import panelKeys from 'constants/panelKeys';

class ForecastsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = panelKeys.FORECASTS_PANEL;
  }
  
  render() {
    return (
      <div className="panel__body">
        <div className="panel__title">
          Forecasts
        </div>
      </div>
    );
  }
}

export default Panel(ForecastsPanel);
