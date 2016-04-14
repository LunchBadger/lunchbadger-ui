import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePrivateEndpoint from '../../actions/PrivateEndpoint/update';
import classNames from 'classnames';
import InlineEdit from 'react-edit-inline';

class PrivateEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    name: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      url: this.props.entity.url
    };
  }

  update() {
    updatePrivateEndpoint(this.props.entity.id, {
      name: this.props.name,
      url: this.state.url
    });
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      const portClass = classNames({
        'canvas-element__port--out': port.portType === 'out',
        'canvas-element__port--in': port.portType === 'in',
        'canvas-element__port': true
      });

      return (
        <Port key={`port-${port.portType}-${port.id}`}
              ref={(ref) => {port.DOMReference = ref}}
              way={port.portType}
              className={portClass}/>
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

export default CanvasElement(PrivateEndpoint);
