import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PrivateEndpoint from '../CanvasElements/PrivateEndpoint';
import updateOrder from '../../actions/Quadrants/Private/updateOrder';
import PrivateEndpointFactory from '../../models/PrivateEndpoint';

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
      return entity.constructor.type === PrivateEndpointFactory.type && (
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
      <div className="quadrant__body">
        {this.renderEntities()}
      </div>
    );
  }
}

export default Quadrant(PrivateQuadrant);
