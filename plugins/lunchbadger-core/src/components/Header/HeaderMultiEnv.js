import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import Logo from './badger-logo.svg';
import {TopBar, PanelBar} from '../../../../lunchbadger-ui/src';

export default class HeaderMultiEnv extends Component {
  render() {
    const {appState, plugins, saveToServer, clearServer, disabledMultiEnvMenu, headerMenuDisabled, username} = this.props;
    return (
      <header className="header" ref="headerContainer">
        <TopBar username={username} />
        <PanelBar disabledMultiEnvMenu={disabledMultiEnvMenu}>
          <HeaderMenu
            plugins={plugins}
            saveToServer={saveToServer}
            clearServer={clearServer}
            disabled={headerMenuDisabled}
          />
        </PanelBar>
      </header>
    );
  }
}
