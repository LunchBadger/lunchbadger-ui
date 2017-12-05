import React, {PureComponent} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import CanvasOverlay from '../Canvas/CanvasOverlay';
import Logo from './badger-logo.svg';
import BrandingLogo from './BrandingLogo.png';
import Config from '../../../../../src/config';
import './Header.scss';

const {tritonLogo} = Config.get('features');

export default class Header extends PureComponent {
  render() {
    const {username, envId, blank} = this.props;
    return (
      <header className="header" ref="headerContainer">
        {!blank && <CanvasOverlay />}
        <img src={Logo} className="Logo" alt="LunchBadger logo - a smiling badger" />
        <p className="logotype" >LunchBadger</p>
        {tritonLogo && <span className="On">on</span>}
        {tritonLogo && <img src={BrandingLogo} className="BrandingLogo" alt="Triton" />}
        {!blank && <Breadcrumbs username={username} envId={envId}/>}
        {!blank && <HeaderMenu />}
      </header>
    );
  }
}
