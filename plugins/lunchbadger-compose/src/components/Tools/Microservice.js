import React, {Component} from 'react';
import cs from 'classnames';
import AddMicroservice from '../../actions/CanvasElements/Microservice/add';

const Tool = LunchBadgerCore.components.Tool;

class Microservice extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Microservice';
    return (
      <div className={cs('model', 'tool', {['tool--selected']: isSelected})} onClick={() => AddMicroservice()}>
        <i className="tool__icon icon-icon-microservice"/>
        <span className="tool__tooltip">Microservice</span>
      </div>
    );
  }
}

export default Tool(Microservice);
