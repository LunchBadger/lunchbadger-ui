import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceMySQL, iconWand} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class MySQL extends Component {
  render() {
    return (
      <div className="sql tool__context__item">
        <div className="tool__item__db" onClick={() => AddDataSource('MySQL', 'mysql')}>
          <IconSVG className="tool__context__svg" svg={iconDataSourceMySQL} />
          <span className="tool__name">MySQL</span>
        </div>
        <div className="tool__item__wand">
          <IconSVG svg={iconWand} />
        </div>
      </div>
    );
  }
}

export default Tool(MySQL);
