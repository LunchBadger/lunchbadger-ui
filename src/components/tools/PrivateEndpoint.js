import React, {Component} from 'react';
import './PrivateEndpoint.scss';
import AddPrivateEndpoint from 'actions/AddPrivateEndpoint';

export default class Aside extends Component {
  render() {
    return (
      <privateendpoint className="privateendpoint" onClick={() => AddPrivateEndpoint()}>
      	<i className="privateendpoint__icon fa fa-github"></i>
      	<span className="privateendpoint__tooltip">Private Endpoint</span>
      </privateendpoint>
    );
  }
}
