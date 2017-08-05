import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
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
    const {panels, canvas, header, container} = this.props;
    return panels.map((panel, idx) => {
      const PanelComponent = panel;
      return (
        <PanelComponent
          key={idx}
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

const selector = createSelector(
  state => !!state.states.currentEditElement,
  state => state.plugins.panels,
  (disabled, panels) => ({disabled, panels}),
);

export default connect(selector)(PanelContainer);
