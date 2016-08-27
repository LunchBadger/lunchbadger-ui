import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

export default class Oracle extends Component {
  render() {
    return (
      <div className="oracle tool__context__item" onClick={() => AddDataSource('Oracle', 'oracle')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">Oracle</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Oracle);
