import React, {Component, PropTypes} from 'react';
import classNames from 'classnames';
import {saveToServer} from '../../utils/serverIo';

export default class HeaderMenuSaveButton extends Component {
  static contextTypes = {
    lunchbadgerConfig: PropTypes.object,
    user: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    };
  }

  saveDetails() {
    saveToServer(this.context.lunchbadgerConfig, this.context.user);
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true,
      'header__menu__link--hidden': true
    });

    return (
      <a href="#" className={linkClass} onClick={this.saveDetails.bind(this)}>
        <i className="fa fa-floppy-o"/>
      </a>
    );
  }
}
