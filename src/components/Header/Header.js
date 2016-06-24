import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import './Header.scss';
import Logo from './badger-logo.svg';

export default class Header extends Component {
  render() {
    return (
      <header className="header" ref="headerContainer">
        <img src={Logo} className="Logo" alt="LunchBadger logo - a smiling badger" />
        <p className="logotype" >LunchBadger</p>
        <Breadcrumbs />
        <HeaderMenu plugins={this.props.plugins} />
      </header>
    );
  }
}
