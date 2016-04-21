import React, {Component} from 'react';
import './Tool.scss';
import AddPrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/add';

export default class BaseTool extends Component {
  render() {
    return (
      <div className="privateendpoint" onClick={() => AddPrivateEndpoint()}>
        <i className="privateendpoint__icon fa fa-github"/>
        <span className="privateendpoint__tooltip">Private Endpoint</span>
      </div>
    );
  }
}
