import React, {Component, PropTypes} from 'react';
import DetailsPanel from './DetailsPanel';

export default class PanelContainer extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired,
    canvas: PropTypes.func.isRequired,
    header: PropTypes.func.isRequired
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
                        plugins={this.props.plugins}
                        canvas={this.props.canvas}
                        header={this.props.header}
                        container={this.props.container} />
      );
    });
  }

  render() {
    return (
      <div>
        <DetailsPanel canvas={this.props.canvas}
                      plugins={this.props.plugins}
                      header={this.props.header}
                      appState={this.props.appState}
                      container={this.props.container}/>
        {this.renderPanels()}
      </div>
    );
  }
}
