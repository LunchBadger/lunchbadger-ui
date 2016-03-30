import React, {Component} from 'react';
import './Tool.scss';
import AddDataSource from 'actions/AddDataSource';

export default class Gateway extends Component {
  render() {
    return (
      <div className="dataSource tool" onClick={() => AddDataSource()}>
      	<i className="tool__icon fa fa-data"></i>
      	<span className="tool__tooltip">Data source</span>
      </div>
    );
  }
}
