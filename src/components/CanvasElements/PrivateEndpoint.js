import React, {Component, PropTypes} from 'react';
import CanvasElement from './CanvasElement';
import Port from './Port';
import './CanvasElement.scss';
import updatePrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/update';
import slug from 'slug';
import Input from 'components/Generics/Form/Input';

class PrivateEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      contextPath: props.entity.contextPath,
      contextPathDirty: false
    };
  }

  update(model) {
    updatePrivateEndpoint(this.props.entity.id, model);
  }

  updateName(event) {
    if (!this.state.contextPathDirty) {
      this.setState({contextPath: slug(event.target.value, {lower: true})});
    }
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              className={`port-${this.props.entity.constructor.type}  port-${port.portGroup}`}
              scope={port.portGroup}/>
      );
    });
  }

  updateContextPath() {
    this.setState({contextPathDirty: true});
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

                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.state.contextPath}
                       name="contextPath"
                       handleChange={this.updateContextPath.bind(this)}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PrivateEndpoint);
