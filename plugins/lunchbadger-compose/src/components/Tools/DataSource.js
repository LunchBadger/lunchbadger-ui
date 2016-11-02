import React, {Component} from 'react';
import REST from './REST';
import MongoDB from './MongoDB';
import Redis from './Redis';
import MySQL from './MySQL';
import Blockchain from './Blockchain';

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
            <Blockchain />
          </li>
        </ul>
      </div>
    );
  }
}

export default Tool(DataSource);
