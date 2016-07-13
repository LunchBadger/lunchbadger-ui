import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

export default class SQL extends Component {
  render() {
    return (
      <div className="sql tool__context__item" onClick={() => AddDataSource('SQL', 'sql')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">SQL</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(SQL);
