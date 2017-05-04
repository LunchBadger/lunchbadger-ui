import React, {Component} from 'react';
import cs from 'classnames';
import AddModel from '../../actions/CanvasElements/Model/add';

const Tool = LunchBadgerCore.components.Tool;

class Model extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Model';
    return (
      <div className={cs('model', 'tool', {['tool--selected']: isSelected})} onClick={() => AddModel()}>
        <i className="tool__icon icon-icon-model"/>
        <span className="tool__tooltip">Model</span>
      </div>
    );
  }
}

export default Tool(Model);
