import React, {Component} from 'react';
import './Tool.scss';
import AddDataSource from 'actions/AddDataSource';

export default class SQL extends Component {
  render() {
    return (
      <div className="sql tool__context__item" onClick={() => AddDataSource()}>
      	<i className="tool__icon fa fa-database"></i>
      	<i className="tool__icon fa fa-sql"></i>
      	<span className="tool__name">SQL</span>
      </div>
    );
  }
}
