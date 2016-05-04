import React, {Component} from 'react';

const Panel = LBCore.components.Panel;
const panelKeys = LBCore.constants.panelKeys;

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
