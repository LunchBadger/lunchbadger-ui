import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import classNames from 'classnames';
import AppState from '../../stores/AppState';
import {togglePanel} from '../../reduxActions';
import {IconSVG} from '../../../../lunchbadger-ui/src/index.js';

class HeaderMenuLink extends Component {
  static propTypes = {
    icon: PropTypes.string,
    kind: PropTypes.string,
    panel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };

  togglePanel = () => {
    const {togglePanel, panel} = this.props;
    togglePanel(panel);
  }

  render() {
    const {kind, icon, svg, panel, currentlyOpenedPanel} = this.props;
    const pressed = currentlyOpenedPanel && currentlyOpenedPanel === panel;
    const linkClass = classNames(kind, {
      'header__menu__link': true,
      'header__menu__link--pressed': pressed,
    });
    return (
      <span className={linkClass} onClick={this.togglePanel}>
        {icon && <i className={`fa ${icon}`} />}
        {svg && <IconSVG className="header__menu__link__svg" svg={svg} />}
      </span>
    );
  }
}

const mapStateToProps = state => ({
  currentlyOpenedPanel: state.core.appState.currentlyOpenedPanel,
});

const mapDispatchToProps = dispatch => ({
  togglePanel: panel => dispatch(togglePanel(panel)),
});

export default connect(mapStateToProps, mapDispatchToProps)(HeaderMenuLink);
