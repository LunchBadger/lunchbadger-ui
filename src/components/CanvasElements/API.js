import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import PublicEndpoint from './Subelements/PublicEndpoint';
import './CanvasElement.scss';
import Sortable from 'react-sortablejs';
import updateAPI from '../../actions/API/update';
import addEndpoint from '../../actions/API/addEndpoint';

const sortableOptions = {
  ref: 'endpoints',
  model: 'endpoints',
  group: {name: 'all', put: true, pull: false},
  onAdd: 'handleAdd',
  sort: false
};

class Product extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };
  handleAdd(evt) {
    console.log('handleAdd:', evt, this.props.entity);
  }

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
          <PublicEndpoint entity={endpoint} paper={this.props.paper}/>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">Endpoints<i onClick={() => this.onAddEndpoint('Endpoint')} className="canvas-element__add fa fa-plus"></i></div>
          <div ref="endpoints">{this.renderEndpoints()}</div>
        </div>
      </div>
    );
  }
}

export default Sortable(sortableOptions)(CanvasElement(Product));
