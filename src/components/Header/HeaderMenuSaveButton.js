import React, {Component} from 'react';
import classNames from 'classnames';

export default class HeaderMenuSaveButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      pressed: false
    };
  }

  render() {
    const linkClass = classNames({
      'header__menu__link': true
    });

    return (
      <a href="#" className={linkClass} onClick={() => alert('test2')}>
        <i className="fa fa-floppy-o"/>
      </a>
    );
  }
}
