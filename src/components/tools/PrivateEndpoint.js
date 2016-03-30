import React, {Component} from 'react';
import './PrivateEndpoint.scss';
import AddPrivateEndpoint from 'actions/AddPrivateEndpoint';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="privateendpoint" onClick={() => AddPrivateEndpoint()}>
      	<i className="privateendpoint__icon fa fa-github"></i>
      	<span className="privateendpoint__tooltip">Private Endpoint</span>
      </div>
    );
  }
}
