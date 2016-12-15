import React, {Component} from 'react';
import classNames from 'classnames';

export default class HeaderMenuSaveButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    };
  }

  saveDetails() {
    this.props.saveToServer();
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true
    });

    return (
      <a href="#" className={linkClass} onClick={this.saveDetails.bind(this)}>
        <i className="fa fa-floppy-o"/>
      </a>
    );
  }
}
