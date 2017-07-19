import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Model from '../CanvasElements/Model';
import Microservice from '../CanvasElements/Microservice';

const updateOrder = LunchBadgerManage.actions.Quadrants.Private.updateOrder;
const saveOrder = LunchBadgerManage.actions.Quadrants.Private.saveOrder;
const PrivateEndpoint = LunchBadgerManage.components.PrivateEndpoint;
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
      switch (entity.constructor.type) {
        case 'Model':
          return (
            <Model paper={this.props.paper}
                   appState={this.props.appState}
                   key={entity.id}
                   icon="icon-icon-model"
                   hideSourceOnDrag={true}
                   itemOrder={entity.itemOrder}
                   moveEntity={this.moveEntity}
                   saveOrder={this.saveOrder}
                   entity={entity}
                   ready={entity.ready}
                   />
          );
        case 'Microservice':
          return (
            <Microservice paper={this.props.paper}
                   appState={this.props.appState}
                   key={entity.id}
                   icon="icon-icon-microservice"
                   hideSourceOnDrag={true}
                   itemOrder={entity.itemOrder}
                   moveEntity={this.moveEntity}
                   saveOrder={this.saveOrder}
                   entity={entity}
                   ready={entity.ready}
                   />
          );
        case 'PrivateEndpoint':
          return (
            <PrivateEndpoint
              paper={this.props.paper}
              appState={this.props.appState}
              key={entity.id}
              icon="icon-icon-endpoint"
              hideSourceOnDrag={true}
              itemOrder={entity.itemOrder}
              moveEntity={this.moveEntity}
              entity={entity}
              ready={entity.ready}
              />
          );
      }
    });
  }

  moveEntity = (entity, itemOrder, hoverOrder) => {
    updateOrder(entity, itemOrder, hoverOrder);
  }

  saveOrder = () => {
    saveOrder();
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
