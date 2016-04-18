import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import PublicEndpoint from './Subelements/PublicEndpoint';
import './CanvasElement.scss';
import updateAPI from '../../actions/API/update';
import addEndpoint from '../../actions/API/addEndpoint';
import removePublicEndpoint from 'actions/PublicEndpoint/remove';
import { DropTarget, DragDropContext } from 'react-dnd';

const boxTarget = {
  drop(props, monitor, component) {
    const item = monitor.getItem();
    const delta = monitor.getDifferenceFromInitialOffset();
    const left = Math.round(item.left + delta.x);
    const top = Math.round(item.top + delta.y);

    component.onAddEndpoint(item.entity.name);
    removePublicEndpoint(item.entity);
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

  update() {
    updateAPI(this.props.entity.id, {
      name: this.props.name
    });
  }

  onAddEndpoint(name) {
    addEndpoint(this.props.entity, name);
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
            top={endpoint.top}/>
        </div>
      );
    });
  }

  render() {
    const { connectDropTarget } = this.props;
    return connectDropTarget(
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">Endpoints<i onClick={() => this.onAddEndpoint('Endpoint')} className="canvas-element__add fa fa-plus"></i></div>
          <div ref="endpoints">{this.renderEndpoints()}</div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(API);
