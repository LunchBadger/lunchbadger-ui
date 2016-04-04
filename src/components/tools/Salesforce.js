import React, {Component} from 'react';
import './Tool.scss';
import AddDataSource from '../../actions/DataSource/add';

export default class Salesforce extends Component {
  render() {
    return (
      <div className="salesforce tool__context__item" onClick={() => AddDataSource()}>
      	<i className="tool__icon fa fa-database"/>
      	<i className="tool__icon over fa fa-cloud"/>
      	<span className="tool__name">Salesforce</span>
      </div>
    );
  }
}
