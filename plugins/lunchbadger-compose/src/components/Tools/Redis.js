import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceRedis, iconWand} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class Redis extends Component {
  render() {
    return (
      <div className="redis tool__context__item">
        <div className="tool__item__db" onClick={() => AddDataSource('Redis', 'redis')}>
        	<IconSVG className="tool__context__svg" svg={iconDataSourceRedis} />
        	<span className="tool__name">Redis</span>
        </div>
        <div className="tool__item__wand">
          <IconSVG svg={iconWand} />
        </div>
      </div>
    );
  }
}

export default Tool(Redis);
