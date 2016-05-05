import React, {Component} from 'react';
import HeaderMenuLink from './HeaderMenuLink';

const Pluggable = LBCore.stores.Pluggable;
const panelKeys = LBCore.constants.panelKeys;

export default class HeaderMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pluggedButtons: Pluggable.getPanelButtons()
    };

    this.pluginStoreChanged = () => {
      this.setState({pluggedButtons: Pluggable.getPanelButtons()});
    }
  }

  componentWillMount() {
    Pluggable.addChangeListener(this.pluginStoreChanged);
  }

  componentWillUnmount() {
    Pluggable.removeChangeListener(this.pluginStoreChanged);
  }

  renderButtons() {
    return this.state.pluggedButtons.map((button) => {
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
          <li className="header__menu__element">
            <HeaderMenuLink togglePanel={panelKeys.FORECASTS_PANEL} icon="fa-cog"/>
          </li>
        </ul>
      </nav>
    );
  }
}
