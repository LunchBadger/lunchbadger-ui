import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import AppState from '../../stores/AppState';
import togglePanel from '../../actions/togglePanel';
import {IconSVG} from '../../../../lunchbadger-ui/src/index.js';

export default class HeaderMenuLink extends Component {
  static propTypes = {
    icon: PropTypes.string,
    togglePanel: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ])
  };

  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    };

    this.appStateUpdate = () => {
      const currentPanel = AppState.getStateKey('currentlyOpenedPanel');

      if (currentPanel && currentPanel === props.togglePanel) {
        this.setState({pressed: true});
      } else {
        this.setState({pressed: false});
      }
    };
  }

  componentWillMount() {
    AppState.addChangeListener(this.appStateUpdate);
  }

  componentWillUnmount() {
    AppState.removeChangeListener(this.appStateUpdate);
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true,
      'header__menu__link--pressed': this.state.pressed
    });
    return (
      <a href="#" className={linkClass} onClick={() => togglePanel(this.props.togglePanel)}>
        {this.props.icon && <i className={`fa ${this.props.icon}`} />}
        {this.props.svg && <IconSVG className="header__menu__link__svg" svg={this.props.svg} />}
      </a>
    );
  }
}
