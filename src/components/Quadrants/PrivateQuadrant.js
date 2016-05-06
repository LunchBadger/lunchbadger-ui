import React, {Component, PropTypes} from 'react';
import PrivateEndpoint from '../CanvasElements/PrivateEndpoint';

const Model = LunchBadgerCompose.components.Model;
const Quadrant = LunchBadgerCore.components.Quadrant;
const updateOrder = LunchBadgerCompose.actions.Private.updateOrder;

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
                   itemOrder={entity.itemOrder}
                   moveEntity={this.moveEntity}
                   entity={entity}/>
          );
        case 'PrivateEndpoint':
          return (
            <PrivateEndpoint
              paper={this.props.paper}
              key={entity.id}
              icon="fa-user-secret"
              hideSourceOnDrag={true}
              itemOrder={entity.itemOrder}
              moveEntity={this.moveEntity}
              entity={entity}/>
          );
      }
    });
  }

  moveEntity(entity, itemOrder, hoverOrder) {
    updateOrder(entity, itemOrder, hoverOrder);
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
