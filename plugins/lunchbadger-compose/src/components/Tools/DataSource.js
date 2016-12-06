import React, {Component} from 'react';
import REST from './REST';
import MongoDB from './MongoDB';
import Redis from './Redis';
import MySQL from './MySQL';
import Ethereum from './Ethereum';
import Salesforce from './Salesforce';

const Tool = LunchBadgerCore.components.Tool;

class DataSource extends Component {
  render() {
    return (
      <div className="dataSource tool context">
        <i className="tool__extend icon-arrowhead"/>
        <i className="tool__icon icon-icon-datasource"/>
        <ul className="tool__context">
          <li>
            <REST />
          </li>
          <li>
            <Redis />
          </li>
          <li>
            <MongoDB />
          </li>
          <li>
            <MySQL />
          </li>
          <li>
            <Ethereum />
          </li>
          <li>
            <Salesforce />
          </li>
        </ul>
      </div>
    );
  }
}

export default Tool(DataSource);
