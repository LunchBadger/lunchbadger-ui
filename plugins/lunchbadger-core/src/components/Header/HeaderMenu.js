import React, {Component} from 'react';
import HeaderMenuLink from './HeaderMenuLink';
import HeaderMenuSaveButton from './HeaderMenuSaveButton';
import panelKeys from '../../constants/panelKeys';
import classNames from 'classnames';

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
    const headerClass = classNames({
      header__menu: true,
      'header__menu--disabled': this.props.appState.getStateKey('currentEditElement')
    });

    return (
      <nav className={headerClass}>
        <ul className="header__menu__list">
          <li className="header__menu__element">
            <HeaderMenuSaveButton saveToServer={this.props.saveToServer} />
          </li>
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={panelKeys.DETAILS_PANEL} icon="icon-icon-details"/>
          </li>
          {this.renderButtons()}
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={null} icon="icon-icon-settings"/>
          </li>
        </ul>
      </nav>
    );
  }
}
