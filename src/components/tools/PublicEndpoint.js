import React, {Component} from 'react';
import './Tool.scss';
import AddPublicEndpoint from '../../actions/PublicEndpoint/add';

export default class PrivateEndpoint extends Component {
  render() {
    return (
      <div className="publicendpoint tool__context__item" onClick={() => AddPublicEndpoint('Public Endpoint')}>
      	<i className="tool__icon fa fa-globe"/>
      	<span className="tool__name">Public Endpoint</span>
      </div>
    );
  }
}
