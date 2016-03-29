import React, {Component} from 'react';
import './Aside.scss';
import PrivateEndpoint from '../tools/PrivateEndpoint';

export default class Aside extends Component {
  render() {
    return (
      <aside className="aside">
      	<PrivateEndpoint />
      </aside>
    );
  }
}
