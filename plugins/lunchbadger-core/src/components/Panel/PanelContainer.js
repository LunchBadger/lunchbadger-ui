import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import DetailsPanel from './DetailsPanel';
import SettingsPanel from './SettingsPanel';
import classNames from 'classnames';
import './PanelContainer.scss';

class PanelContainer extends Component {
  static propTypes = {
    container: PropTypes.func.isRequired,
    canvas: PropTypes.func.isRequired,
    header: PropTypes.func.isRequired,
  };

  renderPanels() {
    const {plugins, appState, canvas, header, container} = this.props;
    return plugins.getPanels().map((panel) => {
      const PanelComponent = panel.panel.component;
      return (
        <PanelComponent
          key={`${panel.panelButton.panelKey}-panel-plugin`}
          appState={appState}
          plugins={plugins}
          canvas={canvas}
          header={header}
          container={container}
        />
      );
    });
  }

  render() {
    const {disabled, canvas, plugins, header, appState, container} = this.props;
    const panelContainerClass = classNames({
      'panel-container': true,
      'panel-container--disabled': disabled,
    });
    return (
      <div className={panelContainerClass}>
        <DetailsPanel
          canvas={canvas}
          plugins={plugins}
          header={header}
          appState={appState}
          container={container}
        />
        {this.renderPanels()}
        <SettingsPanel
          canvas={canvas}
          header={header}
          appState={appState}
          container={container}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  disabled: !!state.core.appState.currentEditElement,
});

export default connect(mapStateToProps)(PanelContainer);
