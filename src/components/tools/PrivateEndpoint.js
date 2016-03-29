import React, {Component} from 'react';
import './PrivateEndpoint.scss';

export default class Aside extends Component {
  render() {
    return (
      <privateendpoint className="privateendpoint">
      	<i className="privateendpoint__icon"></i>
      	<span className="privateendpoint__tooltip">Private Endpoint</span>
      </privateendpoint>
    );
  }
}
