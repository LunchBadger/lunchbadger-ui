import React, {Component} from 'react';
import HeaderMenuLink from './HeaderMenuLink';
import panelKeys from 'constants/panelKeys';

export default class HeaderMenu extends Component {
  constructor(props) {
    super(props);
  }

  renderButtons() {
    return this.props.plugins.getPanelButtons().map((button) => {
      button = button.panelButton;

      return (
        <li key={`${button.panelKey}-button-plugin`} className="header__menu__element">
          <HeaderMenuLink togglePanel={button.panelKey} icon={button.icon}/>
        </li>
      );
    });
  }

  render() {
    return (
      <nav className="header__menu">
        <ul className="header__menu__list">
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={panelKeys.DETAILS_PANEL} icon="fa-list"/>
          </li>
          {this.renderButtons()}
        </ul>
      </nav>
    );
  }
}
