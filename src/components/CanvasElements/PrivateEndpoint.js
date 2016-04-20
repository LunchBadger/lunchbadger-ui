import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePrivateEndpoint from '../../actions/PrivateEndpoint/update';

class PrivateEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object,
    name: PropTypes.string
  };


  constructor(props) {
    super(props);

    this.state = {
      contextPath: this.props.entity.contextPath
    };
  }

  update() {
    updatePrivateEndpoint(this.props.entity.id, {
      name: this.props.name,
      contextPath: this.state.contextPath
    });
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              className={`port-${port.portType} port-${this.props.entity.constructor.type}  port-${port.portGroup}`}
              scope={port.portGroup}/>
      );
    });
  }

  updateContextPath(evt) {
    this.setState({contextPath: evt.target.value});
  }

  render() {
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__title">Properties</div>

          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">Context path</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {this.props.entity.contextPath}
                </span>

                <input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.contextPath}
                       onChange={this.updateContextPath.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PrivateEndpoint);
