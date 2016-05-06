import React, {Component} from 'react';
import AddAPI from '../../actions/CanvasElements/API/add';

const Tool = LunchBadgerCore.components.Tool;

class API extends Component {
  render() {
    return (
      <div className="api tool" onClick={() => AddAPI('API')}>
        <i className="tool__icon fa fa-archive"/>
        <span className="tool__tooltip">API</span>
      </div>
    );
  }
}

export default Tool(API);
