import React, {Component} from 'react';
import AddModel from '../../actions/CanvasElements/Model/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Model extends Component {
  render() {
    return (
      <div className="model tool" onClick={() => AddModel()}>
        <IconSVG className="tool__svg" svg={entityIcons.Model} />
        <span className="tool__tooltip">Model</span>
      </div>
    );
  }
}

export default Tool(Model);
