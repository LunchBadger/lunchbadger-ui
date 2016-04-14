import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePublicEndpoint from '../../actions/PublicEndpoint/update';

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  onNameUpdate(name) {
    updatePublicEndpoint(this.props.entity.id, {name});
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              scope={port.portGroup}/>
      );
    });
  }

  render() {
    return (
      <div>
        {this.renderPorts()}
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
