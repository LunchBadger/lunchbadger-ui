import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import PublicEndpoint from './Subelements/PublicEndpoint';
import PublicEndpointClass from 'models/PublicEndpoint';
import './CanvasElement.scss';
import updateAPI from 'actions/API/update';
import addEndpoint from 'actions/API/addEndpoint';
import removePublicEndpoint from 'actions/PublicEndpoint/remove';
import {DropTarget} from 'react-dnd';
import AppState from 'stores/AppState';
import {findDOMNode} from 'react-dom';

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    if (item.entity.constructor.type === PublicEndpointClass.type) {
      component.onAddEndpoint(item.entity.name);
      removePublicEndpoint(item.entity);
    }
  }
};

@DropTarget('canvasElement', boxTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))

class API extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.previousConnection = null;
  }

  componentDidMount() {
    this.props.paper.bind('connectionDetached', (info) => {
      this.previousConnection = info;
    });
  }

  update() {
    updateAPI(this.props.entity.id, {
      name: this.props.name
    });
  }

  onAddEndpoint(name) {
    addEndpoint(this.props.entity, name);

    setTimeout(() => this.revertConnection());
  }

  revertConnection() {
    if (this.previousConnection) {
      const {source} = this.previousConnection;
      const recentElement = AppState.getStateKey('recentElement');

      if (recentElement && recentElement.props.entity.constructor.type === PublicEndpointClass.type) {
        this.props.paper.connect({source: source, target: findDOMNode(recentElement.refs['port-in'])});
      }
    }
  }

  renderEndpoints() {
    return this.props.entity.endpoints.map((endpoint) => {
      return (
        <div key={endpoint.id} className="canvas-element__sub-element">
          <PublicEndpoint
            parent={this.props.entity}
            key={endpoint.id}
            id={endpoint.id}
            entity={endpoint}
            hideSourceOnDrag={true}
            paper={this.props.paper}
            left={endpoint.left}
            top={endpoint.top}
            hideSourceOnDrag={true}/>
        </div>
      );
    });
  }

  render() {
    const {connectDropTarget} = this.props;
    return connectDropTarget(
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">Endpoints<i
            onClick={() => this.onAddEndpoint('Endpoint')} className="canvas-element__add fa fa-plus"></i></div>
          <div ref="endpoints">{this.renderEndpoints()}</div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(API);
