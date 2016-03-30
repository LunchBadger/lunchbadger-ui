import React, {Component} from 'react';
import './Aside.scss';
import Endpoint from '../tools/Endpoint';
import Gateway from '../tools/Gateway';
import DataSource from '../tools/DataSource';

export default class Aside extends Component {
  render() {
    return (
      <aside className="aside">
      	<Endpoint />
      	<Gateway />
      	<DataSource />
      </aside>
    );
  }
}
