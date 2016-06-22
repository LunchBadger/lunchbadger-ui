import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

export default class Salesforce extends Component {
  render() {
    return (
      <div className="salesforce tool__context__item" onClick={() => AddDataSource('Salesforce', 'salesforce')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">Salesforce</span>
      </div>
    );
  }
}

export default Tool(Salesforce);
