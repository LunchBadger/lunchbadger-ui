import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import PrivateEndpoint from '../CanvasElements/PrivateEndpoint';
import Model from '../CanvasElements/Model';

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
      switch (entity.type) {
        case 'Model':
          return (
            <Model paper={this.props.paper}
                   key={entity.id}
                   icon="fa-car"
                   entity={entity}/>
          );
        case 'PrivateEndpoint':
          return (
            <PrivateEndpoint
              paper={this.props.paper}
              key={entity.id}
              icon="fa-user-secret"
              entity={entity}/>
          );
      }

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

export default Quadrant(PrivateQuadrant);
