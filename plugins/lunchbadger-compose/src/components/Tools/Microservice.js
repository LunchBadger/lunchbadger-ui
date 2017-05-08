import React, {Component} from 'react';
import cs from 'classnames';
import AddMicroservice from '../../actions/CanvasElements/Microservice/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Microservice extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === 'Microservice';
    return (
      <div className={cs('microservice', 'tool', {['tool--selected']: isSelected})} onClick={() => AddMicroservice()}>
        <IconSVG className="tool__svg" svg={entityIcons.Microservice} />
        <span className="tool__tooltip">Microservice</span>
      </div>
    );
  }
}

export default Tool(Microservice);
