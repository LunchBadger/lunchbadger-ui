import React, {Component, PropTypes} from 'react';
import Quadrant from './Quadrant';
import DataSource from '../CanvasElements/DataSource';
import updateDataSource from 'actions/DataSource/update';

class BackendQuadrant extends Component {
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
      return <DataSource paper={this.props.paper}
                         key={entity.id}
                         icon="fa-database"
                         hideSourceOnDrag={true}
                         left={entity.left}
                         top={entity.top}
                         entity={entity}/>;
    })
  }

  moveEntity(entity, left, top) {
    updateDataSource(entity.id, {left, top});
  }

  render() {
    return (
      <div>
        {this.renderEntities()}
      </div>
    );
  }
}

export default Quadrant(BackendQuadrant);
