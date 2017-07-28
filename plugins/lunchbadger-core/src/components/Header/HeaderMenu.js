import React, {Component} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import HeaderMenuLink from './HeaderMenuLink';
// import HeaderMenuSaveButton from './HeaderMenuSaveButton';
// import HeaderMenuClearButton from './HeaderMenuClearButton';
// import panelKeys from '../../constants/panelKeys';
// import {IconSVG} from '../../../../lunchbadger-ui/src/index.js';

class HeaderMenu extends Component {
  // renderButtons() {
  //   return this.props.plugins.getPanelButtons().map((button) => {
  //     button = button.panelButton;
  //     return (
  //       <li key={`${button.panelKey}-button-plugin`} className="header__menu__element">
  //         <HeaderMenuLink panel={button.panelKey} icon={button.icon}/>
  //       </li>
  //     );
  //   });
  // }
  render() {
    const {disabled, panelMenu} = this.props;
    return (
      <nav className={cs('header__menu', {'header__menu--disabled': disabled})}>
        <ul className="header__menu__list">
          {panelMenu.map((item, idx) => <HeaderMenuLink key={idx} {...item} />)}

          {/*}<li className="header__menu__element">
            <HeaderMenuClearButton clearServer={clearServer} />
          </li>
          <li className="header__menu__element">
            <HeaderMenuSaveButton saveToServer={saveToServer} />
          </li>
          <li className="header__menu__element">
            <HeaderMenuLink panel={panelKeys.DETAILS_PANEL} kind="details" svg={iconDetails} />
          </li>
          {this.renderButtons()}
          <li className="header__menu__element">
            <HeaderMenuLink panel={panelKeys.SETTINGS_PANEL} icon="icon-icon-settings"/>
          </li>*/}
        </ul>
      </nav>
    );
  }
}

const selector = createSelector(
  state => state.plugins.panelMenu,
  panelMenu => ({panelMenu: Object.keys(panelMenu).map(key => panelMenu[key])}),
);

export default connect(selector)(HeaderMenu);
