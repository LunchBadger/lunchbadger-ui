import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';

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
      return <div>{entity.name}</div>;
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
