import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import PublicEndpoint from './PublicEndpoint';
import Sortable from 'react-sortablejs';
import './CanvasElement.scss';

const sortableOptions = {
  ref: 'endpoints',
  model: 'endpoints',
  group: {name: 'all', put: true, pull: false},
  onAdd: 'handleAdd',
  sort: false,

};

class Product extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };
  handleAdd(evt) {
    console.log('handleAdd:', evt, this.props.entity);
  }

  renderEndpoints() {
    return this.props.entity.endpoints.map((endpoint) => {
      return (
        <div key={endpoint.id} className="canvas-element__sub-element">
          <PublicEndpoint entity={endpoint} icon="fa-globe"/>
        </div>
      );
    });
  }

  render() {
    return (
      <div>
        <div className="canvas-element__sub-elements">
          <div className="canvas-element__sub-elements__title">Endpoints</div>
          <div ref="endpoints">{this.renderEndpoints()}</div>
        </div>
      </div>
    );
  }
}

export default Sortable(sortableOptions)(CanvasElement(Product));
