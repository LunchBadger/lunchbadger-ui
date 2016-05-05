import React, {Component} from 'react';
import './Tool.scss';
import AddAPI from '../../actions/CanvasElements/API/add';

export default class API extends Component {
  render() {
    return (
      <div className="api tool" onClick={() => AddAPI('API')}>
        <i className="tool__icon fa fa-archive"></i>
        <span className="tool__tooltip">API</span>
      </div>
  );
  }
}
