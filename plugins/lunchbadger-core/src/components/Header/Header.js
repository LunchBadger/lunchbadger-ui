import React, {PureComponent} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
// import CanvasOverlay from '../Canvas/CanvasOverlay';
import Logo from './Logo';
import BrandingLogo from './brandingLogo.png';
// import Config from '../../../../../src/config';
import './Header.scss';

// const {tritonLogo} = Config.get('features');

const tritonLogoUsernames = [
  'al3',
  'clyde',
];

export default class Header extends PureComponent {
  render() {
    const {username, login, envId, blank} = this.props;
    const tritonLogo = tritonLogoUsernames.includes(login);
    return (
      <header className="header" ref="headerContainer">
        {/*!blank && <CanvasOverlay />*/}
        <Logo />
        {tritonLogo && <span className="On">on</span>}
        {tritonLogo && <img src={BrandingLogo} className="BrandingLogo" alt="Triton" />}
        {!blank && <Breadcrumbs username={username} envId={envId}/>}
        {!blank && <HeaderMenu />}
      </header>
    );
  }
}
