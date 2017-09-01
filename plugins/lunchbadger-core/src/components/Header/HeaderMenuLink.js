import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import {IconSVG} from '../../../../lunchbadger-ui/src/index.js';

class HeaderMenuLink extends PureComponent {
  handleClick = () => {
    const {dispatch, action} = this.props;
    dispatch(action);
  };

  render() {
    const {hidden, icon, svg, pressed, panel} = this.props;
    const linkClass = cs('header__menu__link', panel, {
      'header__menu__link--hidden': hidden,
      'header__menu__link--pressed': pressed,
    });
    return (
      <li className="header__menu__element">
        <span className={linkClass} onClick={this.handleClick}>
          {icon && <i className={cs('fa', icon)} />}
          {svg && <IconSVG className="header__menu__link__svg" svg={svg} />}
        </span>
      </li>
    );
  }
}

const selector = createSelector(
  (_, props) => props.panel || '',
  state => state.states.currentlyOpenedPanel,
  (panel, currentlyOpenedPanel) => ({pressed: panel === currentlyOpenedPanel}),
);

export default connect(selector)(HeaderMenuLink);
