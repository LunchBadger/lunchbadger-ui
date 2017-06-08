import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceMemory} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class Memory extends Component {
  render() {
    return (
      <div className="memory tool__context__item" onClick={() => AddDataSource('Memory', 'memory')}>
      	<IconSVG className="tool__context__svg" svg={iconDataSourceMemory} />
      	<span className="tool__name">Memory</span>
      </div>
    );
  }
}

export default Tool(Memory);
