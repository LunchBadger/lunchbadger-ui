import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceMongoDB, iconWand} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class MongoDB extends Component {
  render() {
    return (
      <div className="mongo tool__context__item">
        <div className="tool__item__db" onClick={() => AddDataSource('MongoDB', 'mongodb')}>
          <IconSVG className="tool__context__svg" svg={iconDataSourceMongoDB} />
          <span className="tool__name">MongoDB</span>
        </div>
        <div className="tool__item__wand">
          <IconSVG svg={iconWand} />
        </div>
      </div>
    );
  }
}

export default Tool(MongoDB);
