import React, {Component} from 'react';
import classNames from 'classnames';

export default class HeaderMenuClearButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    };
  }

  clearServer() {
    this.props.clearServer();
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true,
      'header__menu__link--hidden': true
    });

    return (
      <a href="#" className={linkClass} onClick={this.clearServer.bind(this)}>
        <i className="fa fa-trash-o"/>
      </a>
    );
  }
}
