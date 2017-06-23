import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import CanvasOverlay from '../Canvas/CanvasOverlay';
import './Header.scss';
import Logo from './badger-logo.svg';

export default class Header extends Component {
  render() {
    const panelEditingStatus = this.props.appState.getStateKey('panelEditingStatus');
    return (
      <header className="header" ref="headerContainer">
        {panelEditingStatus && <CanvasOverlay appState={this.props.appState} />}
        <img src={Logo} className="Logo" alt="LunchBadger logo - a smiling badger" />
        <p className="logotype" >LunchBadger</p>
        <Breadcrumbs />
        <HeaderMenu appState={this.props.appState}
                    plugins={this.props.plugins}
                    saveToServer={this.props.saveToServer}
                    clearServer={this.props.clearServer} />
      </header>
    );
  }
}
