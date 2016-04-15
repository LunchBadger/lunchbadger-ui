import React, {Component} from 'react';
import './Aside.scss';
import Endpoint from '../tools/Endpoint';
import Gateway from '../tools/Gateway';
import DataSource from '../tools/DataSource';
import Model from '../tools/Model';
import Product from '../tools/API';

export default class Aside extends Component {
  render() {
    return (
      <aside className="aside">
      	<Endpoint />
      	<hr />
      	<Gateway />
      	<hr />
      	<DataSource />
      	<Model />
      	<hr />
        <Product />
      </aside>
    );
  }
}
