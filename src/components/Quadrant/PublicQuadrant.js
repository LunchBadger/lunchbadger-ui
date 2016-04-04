import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import PublicEndpoint from '../CanvasElements/PublicEndpoint';
import Product from '../CanvasElements/Product';

class PublicQuadrant extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    entities: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  renderEntities() {
    return this.props.entities.map((entity) => {
      switch (entity.type) {
        case 'Product':
          return <Product key={entity.id} icon="fa-archive" entity={entity}/>;
        case 'PublicEndpoint':
          return <PublicEndpoint key={entity.id} icon="fa-user" entity={entity}/>;
      }
    })
  }

  render() {
    return (
      <div>
        {this.renderEntities()}
      </div>
    );
  }
}

export default Quadrant(PublicQuadrant);
