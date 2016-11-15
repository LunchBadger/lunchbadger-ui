import React, {Component, PropTypes} from 'react';
import Model from '../CanvasElements/Model';

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

  static contextTypes = {
    projectService: PropTypes.object
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
                   moveEntity={this.moveEntity.bind(this)}
                   saveOrder={this.saveOrder.bind(this)}
                   entity={entity}/>
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
              moveEntity={this.moveEntity.bind(this)}
              entity={entity}/>
          );
      }
    });
  }

  moveEntity(entity, itemOrder, hoverOrder) {
    updateOrder(entity, itemOrder, hoverOrder);
  }

  saveOrder() {
    saveOrder(this.context.projectService);
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
