import React, {Component} from 'react';
import './Tool.scss';
import AddModel from '../../actions/CanvasElements/Model/add';

const Tool = LunchBadgerCore.components.Tool;

class Model extends Component {
  render() {
    return (
      <div className="model tool" onClick={() => AddModel()}>
        <i className="tool__icon fa fa-car"/>
        <span className="tool__tooltip">Model</span>
      </div>
    );
  }
}

export default Tool(Model);
