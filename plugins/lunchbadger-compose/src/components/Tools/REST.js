import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceREST} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class REST extends Component {
  render() {
    return (
      <div className="rest tool__context__item" onClick={() => AddDataSource('REST', 'rest')}>
      	<IconSVG className="tool__context__svg" svg={iconDataSourceREST} />
      	<span className="tool__name">REST</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(REST);
