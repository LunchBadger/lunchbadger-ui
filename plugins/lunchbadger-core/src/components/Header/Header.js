import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import CanvasOverlay from '../Canvas/CanvasOverlay';
import Logo from './badger-logo.svg';
import './Header.scss';

export default class Header extends Component {
  render() {
    const {plugins, saveToServer, clearServer, headerMenuDisabled} = this.props;
    return (
      <header className="header" ref="headerContainer">
        <CanvasOverlay />
        <img src={Logo} className="Logo" alt="LunchBadger logo - a smiling badger" />
        <p className="logotype" >LunchBadger</p>
        <Breadcrumbs />
        <HeaderMenu
          plugins={plugins}
          saveToServer={saveToServer}
          clearServer={clearServer}
          disabled={headerMenuDisabled}
        />
      </header>
    );
  }
}
