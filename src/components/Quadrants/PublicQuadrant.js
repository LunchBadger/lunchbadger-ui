import React, {Component, PropTypes} from 'react';
import PublicEndpoint from '../CanvasElements/PublicEndpoint';
import updateOrder from '../../actions/Quadrants/Public/updateOrder';

const Quadrant = LunchBadgerCore.components.Quadrant;

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
      return (
        <PublicEndpoint key={entity.id}
                        paper={this.props.paper}
                        id={entity.id}
                        icon="fa-user"
                        hideSourceOnDrag={true}
                        itemOrder={entity.itemOrder}
                        moveEntity={this.moveEntity}
                        entity={entity}/>
      );
    })
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

export default Quadrant(PublicQuadrant);
