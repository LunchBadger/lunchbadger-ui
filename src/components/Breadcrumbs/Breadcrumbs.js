import React, {Component} from 'react';
import './Breadcrumbs.scss';

export default class Breadcrumbs extends Component {
  render() {
    return (
      <div className="breadcrumbs">
        <span className="breadcrumbs__element">Project 01</span>
        <span className="breadcrumbs__element">Canvas</span>
      </div>
    );
  }
}
