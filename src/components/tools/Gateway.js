import React, {Component} from 'react';
import './Tool.scss';
import DeployGateway from '../../actions/Gateway/deploy';

export default class Gateway extends Component {
  render() {
    return (
      <div className="gateway tool" onClick={() => DeployGateway()}>
      	<i className="tool__icon fa fa-cloud"/>
      	<span className="tool__tooltip">Gateway</span>
      </div>
    );
  }
}
