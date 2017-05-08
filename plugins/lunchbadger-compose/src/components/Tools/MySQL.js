import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class MySQL extends Component {
  render() {
    return (
      <div className="sql tool__context__item" onClick={() => AddDataSource('MySQL', 'mysql')}>
      	<IconSVG className="tool__context__svg" svg={entityIcons.DataSource} />
      	<span className="tool__name">MySQL</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(MySQL);
