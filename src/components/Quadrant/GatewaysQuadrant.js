import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import Gateway from '../CanvasElements/Gateway';
import updateGateway from 'actions/Gateway/update';

class GatewaysQuadrant extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    entities: PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  renderEntities() {
    return this.props.entities.map((entity) => {
      return <Gateway key={entity.id}
                      icon="fa-exchange"
                      paper={this.props.paper}
                      hideSourceOnDrag={true}
                      left={entity.left}
                      top={entity.top}
                      entity={entity}/>;
    })
  }

  moveEntity(entity, left, top) {
    updateGateway(entity.id, {left, top});
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
