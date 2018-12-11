import React, {PureComponent} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import Logo from './Logo';
import './Header.scss';

const {search} = document.location;
const isBrandingLogo = search.startsWith('?[') && search.endsWith(']');
const branding = isBrandingLogo ? decodeURI(search.substr(2, search.length - 3)) : '';

export default class Header extends PureComponent {
  render() {
    const {username, envId, blank} = this.props;
    return (
      <header className="header" ref="headerContainer">
        <Logo />
        {isBrandingLogo && <span className="On">on <strong>{branding}</strong></span>}
        {!blank && <Breadcrumbs username={username} envId={envId}/>}
        {!blank && <HeaderMenu />}
      </header>
    );
  }
}
