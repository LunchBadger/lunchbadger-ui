import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import Logo from './badger-logo.svg';
import {TopBar, PanelBar} from '../../../../lunchbadger-ui/src';

export default class HeaderMultiEnv extends Component {
  render() {
    const {appState, plugins, saveToServer, clearServer} = this.props;
    const disabledMultiEnvMenu = !!appState.getStateKey('currentEditElement') || !!appState.getStateKey('isPanelOpened');
    return (
      <header className="header" ref="headerContainer">
        <TopBar />
        <PanelBar disabledMultiEnvMenu={disabledMultiEnvMenu}>
          <HeaderMenu
            appState={appState}
            plugins={plugins}
            saveToServer={saveToServer}
            clearServer={clearServer}
          />
        </PanelBar>
      </header>
    );
  }
}
