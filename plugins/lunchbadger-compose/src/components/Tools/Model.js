import React, {Component} from 'react';
import cs from 'classnames';
import AddModel from '../../actions/CanvasElements/Model/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;
const {defaultEntityNames} = LunchBadgerCore.utils;

class Model extends Component {
  render() {
    const isSelected = (this.props.currentEditElement || {name: ''}).name === defaultEntityNames.Model;
    return (
      <div className={cs('model', 'tool', {['tool--selected']: isSelected})} onClick={() => AddModel()}>
        <IconSVG className="tool__svg" svg={entityIcons.Model} />
        <span className="tool__tooltip">Model</span>
      </div>
    );
  }
}

export default Tool(Model);
