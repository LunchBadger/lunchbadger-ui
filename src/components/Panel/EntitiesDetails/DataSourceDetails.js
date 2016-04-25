import React, {Component, PropTypes} from 'react';
import BaseDetails from 'components/Panel/EntitiesDetails/BaseDetails'
import updateDataSource from 'actions/CanvasElements/DataSource/update';

class DataSourceDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);


  }

  update() {
    updateDataSource(this.props.entity.id, {
      name: this.props.name
    });
  }


  render() {
    return (
      <h2>{this.props.name}</h2>
    )
  }
}

export default BaseDetails(DataSourceDetails);

