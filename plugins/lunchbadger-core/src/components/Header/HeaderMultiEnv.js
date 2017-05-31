import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import Logo from './badger-logo.svg';
import {TopBar, PanelBar} from '../../../../lunchbadger-ui/src';

export default class HeaderMultiEnv extends Component {
  render() {
    return (
      <header className="header" ref="headerContainer">
        <TopBar />
        <PanelBar>
          <HeaderMenu
            appState={this.props.appState}
            plugins={this.props.plugins}
            saveToServer={this.props.saveToServer}
            clearServer={this.props.clearServer}
          />
        </PanelBar>
      </header>
    );
  }
}
