import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

export default class Oracle extends Component {
  render() {
    return (
      <div className="oracle tool__context__item" onClick={() => AddDataSource('Oracle')}>
      	<i className="tool__icon fa fa-database"/>
      	<i className="tool__icon fa fa-oracle"/>
      	<span className="tool__name">Oracle</span>
      </div>
    );
  }
}

export default Tool(Oracle);
