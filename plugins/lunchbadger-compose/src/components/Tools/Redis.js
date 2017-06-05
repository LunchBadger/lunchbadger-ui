import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceRedis} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class Redis extends Component {
  render() {
    return (
      <div className="redis tool__context__item" onClick={() => AddDataSource('Redis', 'redis')}>
      	<IconSVG className="tool__context__svg" svg={iconDataSourceRedis} />
      	<span className="tool__name">Redis</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Redis);
