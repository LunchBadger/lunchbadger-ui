import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import PublicEndpoint from './Subelements/PublicEndpoint';
import './CanvasElement.scss';
import updateAPI from '../../actions/CanvasElements/API/update';
import bundleAPI from 'actions/CanvasElements/API/bundle';
import moveBetweenAPIs from 'actions/CanvasElements/API/rebundle';
import _ from 'lodash';

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

  onDrop(item) {
    if (item.parent) {
      this.onMoveEndpoint(item);
    }

    if (!_.includes(this.props.entity.endpoints, item.entity)) {
      this.onAddEndpoint(item.entity);
    }
  }

  onAddEndpoint(endpoint) {
    bundleAPI(this.props.entity, endpoint);
  }

  onMoveEndpoint(item) {
    moveBetweenAPIs(item.parent, this.props.entity, item.entity);
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
            paper={this.props.paper}
            left={endpoint.left}
            top={endpoint.top}
            hideSourceOnDrag={true}/>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">
            Endpoints
            <i onClick={() => this.onAddEndpoint('Endpoint')} className="canvas-element__add fa fa-plus"/>
          </div>
          <div ref="endpoints">{this.renderEndpoints()}</div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(API);
