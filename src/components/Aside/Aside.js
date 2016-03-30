import React, {Component} from 'react';
import './Aside.scss';
import PrivateEndpoint from '../tools/PrivateEndpoint';
import PublicEndpoint from '../tools/PublicEndpoint';
import Gateway from '../tools/Gateway';
import DataSource from '../tools/DataSource';

export default class Aside extends Component {
  render() {
    return (
      <aside className="aside">
      	<PrivateEndpoint />
      	<PublicEndpoint />
      	<Gateway />
      	<DataSource />
      </aside>
    );
  }
}
