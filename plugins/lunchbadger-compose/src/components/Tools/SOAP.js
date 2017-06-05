import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceSOAP} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class SOAP extends Component {
  render() {
    return (
      <div className="soap tool__context__item" onClick={() => AddDataSource('SOAP', 'soap')}>
      	<IconSVG className="tool__context__svg" svg={iconDataSourceSOAP} />
      	<span className="tool__name">SOAP</span>
      </div>
    );
  }
}

export default Tool(SOAP);
