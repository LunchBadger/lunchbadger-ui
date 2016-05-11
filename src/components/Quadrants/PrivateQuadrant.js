import React, {Component, PropTypes} from 'react';
import PrivateEndpoint from '../CanvasElements/PrivateEndpoint';
import updateOrder from 'actions/Quadrants/Private/updateOrder';

const Quadrant = LunchBadgerCore.components.Quadrant;

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
      return (
        <PrivateEndpoint
          paper={this.props.paper}
          appState={this.props.appState}
          key={entity.id}
          icon="fa-user-secret"
          hideSourceOnDrag={true}
          itemOrder={entity.itemOrder}
          moveEntity={this.moveEntity}
          entity={entity}/>
      );
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
