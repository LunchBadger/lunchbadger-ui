import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import PublicEndpoint from './PublicEndpoint';
import './CanvasElement.scss';

class Product extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

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
          {this.renderEndpoints()}
        </div>
      </div>
    );
  }
}

export default CanvasElement(Product);
