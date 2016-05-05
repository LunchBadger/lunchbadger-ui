import React, {Component, PropTypes} from 'react';
import DetailsPanel from './DetailsPanel';

const Pluggable = LBCore.stores.Pluggable;

export default class PanelContainer extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired,
    canvas: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      pluggedPanels: Pluggable.getPanels()
    };

    this.pluginStoreChanged = () => {
      this.setState({pluggedPanels: Pluggable.getPanels()});
    }
  }

  componentWillMount() {
    Pluggable.addChangeListener(this.pluginStoreChanged);
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.pluginStoreChanged);
  }

  renderPanels() {
    return this.state.pluggedPanels.map((panel) => {
      const PanelComponent = panel.panel.component;

      return (
        <PanelComponent key={`${panel.panelButton.panelKey}-panel-plugin`}
                        canvas={this.props.canvas}
                        container={this.props.container} />
      );
    });
  }

  render() {
    return (
      <div>
        <DetailsPanel canvas={this.props.canvas}
                      container={this.props.container}/>
        {this.renderPanels()}
      </div>
    );
  }
}
