import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import PublicEndpoint from '../CanvasElements/PublicEndpoint';

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
      return <PublicEndpoint icon="fa-user" entity={entity}/>;
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

export default Quadrant(PublicQuadrant);
