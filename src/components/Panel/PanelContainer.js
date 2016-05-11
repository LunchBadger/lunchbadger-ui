import React, {Component, PropTypes} from 'react';
import DetailsPanel from './DetailsPanel';

export default class PanelContainer extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired,
    canvas: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderPanels() {
    return this.props.plugins.getPanels().map((panel) => {
      const PanelComponent = panel.panel.component;

      return (
        <PanelComponent key={`${panel.panelButton.panelKey}-panel-plugin`}
                        appState={this.props.appState}
                        canvas={this.props.canvas}
                        container={this.props.container} />
      );
    });
  }

  render() {
    return (
      <div>
        <DetailsPanel canvas={this.props.canvas}
                      appState={this.props.appState}
                      container={this.props.container}/>
        {this.renderPanels()}
      </div>
    );
  }
}
