import React, {PureComponent} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import HeaderMenu from './HeaderMenu';
import Logo from './Logo';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {
  iconBrandingAws,
  iconBrandingAzure,
  iconBrandingGcp,
  iconBrandingIbm,
  iconBrandingTriton,
} from '../../../../../src/icons';
import './Header.scss';

const {search} = document.location;
const isBrandingLogo = search.startsWith('?[') && search.endsWith(']');
const branding = isBrandingLogo ? decodeURI(search.substr(2, search.length - 3)) : '';
const brandingLogos = {
  aws: iconBrandingAws,
  azure: iconBrandingAzure,
  gcp: iconBrandingGcp,
  ibm: iconBrandingIbm,
  triton: iconBrandingTriton,
};
const brandingLogo = brandingLogos[branding];

export default class Header extends PureComponent {
  render() {
    const {username, envId, blank} = this.props;
    return (
      <header className="header" ref="headerContainer">
        <Logo />
        {isBrandingLogo && (
          <span className="On">
            on
            {' '}
            {brandingLogo && (
              <div className="brandingLogo">
                <IconSVG svg={brandingLogo} />
              </div>
            )}
            {!brandingLogo && <strong>{branding}</strong>}
          </span>
        )}
        {!blank && <Breadcrumbs username={username} envId={envId}/>}
        {!blank && <HeaderMenu />}
      </header>
    );
  }
}
