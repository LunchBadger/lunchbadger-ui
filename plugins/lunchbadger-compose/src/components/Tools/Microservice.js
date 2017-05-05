import React, {Component} from 'react';
import AddMicroservice from '../../actions/CanvasElements/Microservice/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Microservice extends Component {
  render() {
    return (
      <div className="model tool" onClick={() => AddMicroservice()}>
        <IconSVG className="tool__svg" svg={entityIcons.Microservice} />
        <span className="tool__tooltip">Microservice</span>
      </div>
    );
  }
}

export default Tool(Microservice);
