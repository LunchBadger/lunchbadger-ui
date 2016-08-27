import React, {Component, PropTypes} from 'react';
import API from '../CanvasElements/API';
import Portal from '../CanvasElements/Portal';

const Quadrant = LunchBadgerCore.components.Quadrant;
const PublicEndpoint = LunchBadgerManage.components.PublicEndpoint;
const updateOrder = LunchBadgerManage.actions.Quadrants.Public.updateOrder;

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
      switch (entity.constructor.type) {
        case 'API':
          return (
            <API key={entity.id}
                 paper={this.props.paper}
                 appState={this.props.appState}
                 id={entity.id}
                 icon="icon-icon-product"
                 hideSourceOnDrag={true}
                 itemOrder={entity.itemOrder}
                 moveEntity={this.moveEntity}
                 entity={entity}/>
          );
        case 'Portal':
          return (
            <Portal key={entity.id}
                    paper={this.props.paper}
                    appState={this.props.appState}
                    id={entity.id}
                    icon="icon-icon-portal"
                    hideSourceOnDrag={true}
                    itemOrder={entity.itemOrder}
                    ready={entity.ready}
                    moveEntity={this.moveEntity}
                    entity={entity}/>
          );
        case 'PublicEndpoint':
          return (
            <PublicEndpoint key={entity.id}
                            paper={this.props.paper}
                            appState={this.props.appState}
                            id={entity.id}
                            icon="icon-icon-endpoint"
                            hideSourceOnDrag={true}
                            itemOrder={entity.itemOrder}
                            moveEntity={this.moveEntity}
                            entity={entity}/>
          );
      }
    })
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

export default Quadrant(PublicQuadrant);
