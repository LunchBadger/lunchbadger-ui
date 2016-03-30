import React, {Component} from 'react';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './Header.scss';

export default class Header extends Component {
  render() {
    return (
      <header className="header">
        <Breadcrumbs />
      </header>
    );
  }
}
