import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

class Ethereum extends Component {
  render() {
    return (
      <div className="ethereum tool__context__item" onClick={() => AddDataSource('Ethereum', 'web3')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">Ethereum</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Ethereum);
