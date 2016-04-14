import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import Gateway from '../CanvasElements/Gateway';

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
                      entity={entity}/>;
    })
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
