import React, {Component} from 'react';
import './Tool.scss';
import AddDataSource from '../../actions/DataSource/add';

export default class Mongo extends Component {
  render() {
    return (
      <div className="mongo tool__context__item" onClick={() => AddDataSource()}>
      	<i className="tool__icon fa fa-database"/>
      	<i className="tool__icon over fa fa-leaf"/>
      	<span className="tool__name">Mongo</span>
      </div>
    );
  }
}
