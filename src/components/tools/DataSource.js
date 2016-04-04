import React, {Component} from 'react';
import './Tool.scss';
import Memory from './Memory';
import Mongo from './Mongo';
import Oracle from './Oracle';
import SQL from './SQL';
import Salesforce from './Salesforce';

export default class DataSource extends Component {
  render() {
    return (
      <div className="dataSource tool context">
        <i className="tool__extend fa fa-caret-down"/>
        <i className="tool__icon fa fa-database"/>
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
