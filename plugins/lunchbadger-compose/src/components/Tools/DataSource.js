import React, {Component} from 'react';
import cs from 'classnames';
import Memory from './Memory';
import REST from './REST';
import SOAP from './SOAP';
import MongoDB from './MongoDB';
import Redis from './Redis';
import MySQL from './MySQL';
import Ethereum from './Ethereum';
import Salesforce from './Salesforce';
import {entityIcons, IconSVG} from '../../../../lunchbadger-ui/src';

const Tool = LunchBadgerCore.components.Tool;

class DataSource extends Component {
  render() {
    const isSelected = [
      'Memory',
      'REST',
      'SOAP',
      'MongoDB',
      'Redis',
      'MySQL',
      'Ethereum',
      'Salesforce',
    ].includes((this.props.currentEditElement || {name: ''}).name);
    return (
      <div className={cs('dataSource', 'tool', 'context', {['tool--selected']: isSelected})}>
        <i className="tool__extend icon-arrowhead"/>
        <IconSVG className="tool__svg" svg={entityIcons.DataSource} />
        <ul className="tool__context">
          <li>
            <Memory />
          </li>
          <li>
            <REST />
          </li>
          <li>
            <SOAP />
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
