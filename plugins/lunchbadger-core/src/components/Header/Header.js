import React, {PureComponent} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import Logo from './Logo';
import './Header.scss';

const BRANDING_KEY = '?branding=';
const {search} = document.location;
const isBrandingLogo = search.startsWith(BRANDING_KEY);
const branding = isBrandingLogo ? decodeURI(search.split(BRANDING_KEY)[1]) : '';

export default class Header extends PureComponent {
  render() {
    const {username, envId, blank} = this.props;
    return (
      <header className="header" ref="headerContainer">
        <Logo />
        {isBrandingLogo && <span className="On">on <strong>{branding}</strong></span>}
        {/*isBrandingLogo && <span className="BrandingLogo">{branding}</span>*/}
        {!blank && <Breadcrumbs username={username} envId={envId}/>}
        {!blank && <HeaderMenu />}
      </header>
    );
  }
}
