import React, {Component} from 'react';
import AddDataSource from '../../actions/CanvasElements/DataSource/add';
import {IconSVG} from '../../../../lunchbadger-ui/src';
import {iconDataSourceEthereum} from '../../../../../src/icons';

const Tool = LunchBadgerCore.components.Tool;

class Ethereum extends Component {
  render() {
    return (
      <div className="ethereum tool__context__item" onClick={() => AddDataSource('Ethereum', 'web3')}>
      	<IconSVG className="tool__context__svg" svg={iconDataSourceEthereum} />
      	<span className="tool__name">Ethereum</span>
      </div>
    );
  }
}

export default Tool(Ethereum);
