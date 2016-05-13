import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

class Memory extends Component {
  render() {
    return (
      <div className="memory tool__context__item" onClick={() => AddDataSource('Memory', 'memory')}>
      	<i className="tool__icon fa fa-database"/>
      	<span className="tool__name">Memory</span>
      </div>
    );
  }
}

export default Tool(Memory);
