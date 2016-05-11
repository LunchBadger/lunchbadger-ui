import React, {Component, PropTypes} from 'react';
import Gateway from 'components/CanvasElements/Gateway';
import updateOrder from 'actions/Quadrants/Gateway/updateOrder';

const Quadrant = LunchBadgerCore.components.Quadrant;

class GatewaysQuadrant extends Component {
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
      return <Gateway key={entity.id}
                      icon="fa-exchange"
                      paper={this.props.paper}
                      appState={this.props.appState}
                      hideSourceOnDrag={true}
                      itemOrder={entity.itemOrder}
                      moveEntity={this.moveEntity}
                      ready={entity.ready}
                      entity={entity}/>;
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

export default Quadrant(GatewaysQuadrant);
