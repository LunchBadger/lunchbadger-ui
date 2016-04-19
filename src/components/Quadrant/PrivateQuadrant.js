import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import PrivateEndpoint from '../CanvasElements/PrivateEndpoint';
import Model from '../CanvasElements/Model';
import updatePrivateEndpoint from 'actions/PrivateEndpoint/update';
import updateModel from 'actions/Model/update';

class PrivateQuadrant extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    entities: PropTypes.array,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  renderEntities() {
    return this.props.entities.map((entity) => {
      switch (entity.constructor.type) {
        case 'Model':
          return (
            <Model paper={this.props.paper}
                   key={entity.id}
                   icon="fa-car"
                   hideSourceOnDrag={true}
                   left={entity.left}
                   top={entity.top}
                   entity={entity}/>
          );
        case 'PrivateEndpoint':
          return (
            <PrivateEndpoint
              paper={this.props.paper}
              key={entity.id}
              icon="fa-user-secret"
              hideSourceOnDrag={true}
              left={entity.left}
              top={entity.top}
              entity={entity}/>
          );
      }
    });
  }

  moveEntity(entity, left, top) {
    switch (entity.constructor.type) {
      case 'PrivateEndpoint':
        updatePrivateEndpoint(entity.id, {left, top});
        break;
      case 'Model':
        updateModel(entity.id, {left, top});
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

export default Quadrant(PrivateQuadrant);
