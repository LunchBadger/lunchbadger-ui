import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

class REST extends Component {
  render() {
    return (
      <div className="memory tool__context__item" onClick={() => AddDataSource('REST', 'rest')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">REST</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(REST);
