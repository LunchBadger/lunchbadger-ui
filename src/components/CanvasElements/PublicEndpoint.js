import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePublicEndpoint from '../../actions/PublicEndpoint/update';

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    name: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      url: this.props.entity.url
    };
  }

  update() {
    updatePublicEndpoint(this.props.entity.id, {
      name: this.props.name,
      url: this.state.url
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

  updateURL(evt) {
    this.setState({url: evt.target.value});
  }

  render() {
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__url extras">
          <span className="canvas-element__property-title">URL</span>
          <span className="canvas-element__property-value">{this.props.entity.url}</span>
          <input value={this.state.url} onChange={this.updateURL.bind(this)}/>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
