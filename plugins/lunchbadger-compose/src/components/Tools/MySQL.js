import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceMySQL} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class MySQL extends Component {
  render() {
    return (
      <div className="sql tool__context__item" onClick={() => AddDataSource('MySQL', 'mysql')}>
      	<IconSVG className="tool__context__svg" svg={iconDataSourceMySQL} />
      	<span className="tool__name">MySQL</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(MySQL);
