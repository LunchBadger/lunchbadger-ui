import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

class Blockchain extends Component {
  render() {
    return (
      <div className="blockchain tool__context__item" onClick={() => AddDataSource('Blockchain', 'blockchain')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">Blockchain</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Blockchain);
