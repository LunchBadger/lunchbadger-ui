import React, {Component} from 'react';
import './Tool.scss';
import AddGateway from '../../actions/Gateway/add';

export default class Gateway extends Component {
  render() {
    return (
      <div className="gateway tool" onClick={() => AddGateway()}>
      	<i className="tool__icon fa fa-cloud"/>
      	<span className="tool__tooltip">Gateway</span>
      </div>
    );
  }
}
