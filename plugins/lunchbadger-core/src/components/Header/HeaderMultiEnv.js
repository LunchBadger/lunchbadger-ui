import React, {Component} from 'react';
import HeaderMenu from './HeaderMenu';
import {TopBar, PanelBar} from '../../../../lunchbadger-ui/src';

export default class HeaderMultiEnv extends Component {
  render() {
    const {disabledMultiEnvMenu, headerMenuDisabled, username} = this.props;
    return (
      <header className="header" ref="headerContainer">
        <TopBar username={username} />
        <PanelBar disabledMultiEnvMenu={disabledMultiEnvMenu}>
          <HeaderMenu
            disabled={headerMenuDisabled}
          />
        </PanelBar>
      </header>
    );
  }
}
