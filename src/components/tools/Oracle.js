import React, {Component} from 'react';
import './Tool.scss';
import AddDataSource from 'actions/AddDataSource';

export default class Oracle extends Component {
  render() {
    return (
      <div className="oracle tool__context__item" onClick={() => AddDataSource()}>
      	<i className="tool__icon fa fa-database"></i>
      	<i className="tool__icon fa fa-oracle"></i>
      	<span className="tool__name">Oracle</span>
      </div>
    );
  }
}
