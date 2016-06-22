import React, {Component} from 'react';
import Memory from './Memory';
import Mongo from './Mongo';
import Oracle from './Oracle';
import SQL from './SQL';
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
            <Memory />
          </li>
          <li>
            <Oracle />
          </li>
          <li>
            <Mongo />
          </li>
          <li>
            <SQL />
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
