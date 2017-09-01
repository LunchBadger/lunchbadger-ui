import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import HeaderMenuLink from './HeaderMenuLink';

class HeaderMenu extends PureComponent {
  render() {
    const {disabled, panelMenu} = this.props;
    return (
      <nav className={cs('header__menu', {'header__menu--disabled': disabled})}>
        <ul className="header__menu__list">
          {panelMenu.map((item, idx) => <HeaderMenuLink key={idx} {...item} />)}
        </ul>
      </nav>
    );
  }
}

const selector = createSelector(
  state => state.plugins.panelMenu,
  state => !!state.states.currentEditElement,
  (panelMenu, disabled) => ({
    panelMenu: Object.keys(panelMenu).map(key => panelMenu[key]),
    disabled,
  }),
);

export default connect(selector)(HeaderMenu);
