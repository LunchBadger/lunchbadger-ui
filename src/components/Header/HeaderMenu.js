import React, {Component} from 'react';
import togglePanel from 'actions/togglePanel';
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
            <a href="#" className="header__menu__link" onClick={() => togglePanel(panelKeys.DETAILS_PANEL)}>
              <i className="fa fa-list"/>
            </a>
          </li>
          <li className="header__menu__element">
            <a href="#" className="header__menu__link" onClick={() => togglePanel(panelKeys.METRICS_PANEL)}>
              <i className="fa fa-bar-chart"/>
            </a>
          </li>
          <li className="header__menu__element">
            <a href="#" className="header__menu__link" onClick={() => togglePanel(panelKeys.FORECASTS_PANEL)}>
              <i className="fa fa-cog"/>
            </a>
          </li>
        </ul>
      </nav>
    );
  }
}
