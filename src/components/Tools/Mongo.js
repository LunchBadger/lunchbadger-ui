import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

export default class Mongo extends Component {
  render() {
    return (
      <div className="mongo tool__context__item" onClick={() => AddDataSource('Mongo', 'mongo')}>
      	<i className="tool__icon icon-icon-datasource"/>
      	<span className="tool__name">Mongo</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Mongo);
