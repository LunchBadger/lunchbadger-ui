import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class Salesforce extends Component {
  render() {
    return (
      <div className="salesforce tool__context__item" onClick={() => AddDataSource('Salesforce', 'salesforce')}>
      	<IconSVG className="tool__context__svg" svg={entityIcons.DataSource} />
      	<span className="tool__name">Salesforce</span>
        <span className="tool__context__tooltip">Data Source</span>
      </div>
    );
  }
}

export default Tool(Salesforce);
