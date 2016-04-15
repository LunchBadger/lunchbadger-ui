import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updateModel from '../../actions/Model/update';

class Model extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    name: PropTypes.string.isRequired
  };

  update() {
    updateModel(this.props.entity.id, {
      name: this.props.name
    });
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              className={`port-${port.portType} port-${this.props.entity.constructor.type} port-${port.portGroup}`}
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

export default CanvasElement(Model);
