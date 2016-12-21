import React, {Component} from 'react';
import AddMicroservice from '../../actions/CanvasElements/Microservice/add';

const Tool = LunchBadgerCore.components.Tool;

class Microservice extends Component {
  render() {
    return (
      <div className="model tool" onClick={() => AddMicroservice()}>
        <i className="tool__icon icon-icon-microservice"/>
        <span className="tool__tooltip">Microservice</span>
      </div>
    );
  }
}

export default Tool(Microservice);
