import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';

const Tool = LunchBadgerCore.components.Tool;

export default class Mongo extends Component {
  render() {
    return (
      <div className="mongo tool__context__item" onClick={() => AddDataSource('Mongo')}>
      	<i className="tool__icon fa fa-database"/>
      	<i className="tool__icon over fa fa-leaf"/>
      	<span className="tool__name">Mongo</span>
      </div>
    );
  }
}

export default Tool(Mongo);
