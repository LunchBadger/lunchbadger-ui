import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import PublicEndpoint from '../CanvasElements/PublicEndpoint';
import updatePublicEndpoint from 'actions/PublicEndpoint/update';
import updateAPI from 'actions/API/update';
import API from '../CanvasElements/API';

class PublicQuadrant extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    entities: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state  = {
      entities: this.props.entities
    };
  }

  renderEntities() {
    return this.props.entities.map((entity) => {
      switch (entity.constructor.type) {
        case 'API':
          return (
            <API key={entity.id}
                 paper={this.props.paper}
                 id={entity.id}
                 icon="fa-archive"
                 hideSourceOnDrag={true}
                 left={entity.left}
                 top={entity.top}
                 entity={entity}/>
          );
        case 'PublicEndpoint':
          return (
            <PublicEndpoint key={entity.id}
                            paper={this.props.paper}
                            id={entity.id}
                            icon="fa-user"
                            hideSourceOnDrag={true}
                            left={entity.left}
                            top={entity.top}
                            entity={entity}/>
          );
      }
    })
  }

  moveEntity(entity, left, top) {
    switch (entity.constructor.type) {
      case 'PublicEndpoint':
        updatePublicEndpoint(entity.id, {left, top});
        break;
      case 'API':
        updateAPI(entity.id, {left, top});
        break;
    }
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
