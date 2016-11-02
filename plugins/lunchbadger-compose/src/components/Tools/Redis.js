import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

class Redis extends Component {
  render() {
    return (
      <div className="redis tool__context__item" onClick={() => AddDataSource('Redis', 'redis')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">Redis</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Redis);
