import React, {Component} from 'react';

export const FORECASTS_PANEL = 'FORECASTS_PANEL';

class ForecastsPanel extends Component {
  constructor(props) {
    super(props);

    props.parent.storageKey = FORECASTS_PANEL;
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

export default LBCore.components.Panel(ForecastsPanel);
