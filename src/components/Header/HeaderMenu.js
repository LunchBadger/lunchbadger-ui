import React, {Component} from 'react';
import HeaderMenuLink from './HeaderMenuLink';
import panelKeys from 'constants/panelKeys';

export default class HeaderMenu extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <nav className="header__menu">
        <ul className="header__menu__list">
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={panelKeys.DETAILS_PANEL} icon="fa-list"/>
          </li>
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={panelKeys.METRICS_PANEL} icon="fa-bar-chart"/>
          </li>
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={panelKeys.FORECASTS_PANEL} icon="fa-cog"/>
          </li>
        </ul>
      </nav>
    );
  }
}
