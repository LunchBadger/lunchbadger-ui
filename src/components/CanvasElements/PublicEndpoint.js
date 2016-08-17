import React, {Component, PropTypes} from 'react';
import getPublicEndpointUrl from '../../utils/getPublicEndpointUrl';
import updatePublicEndpoint from '../../actions/CanvasElements/PublicEndpoint/update';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;
const Port = LunchBadgerCore.components.Port;

class PublicEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    updatePublicEndpoint(this.props.entity.id, model);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port key={`port-${port.portType}-${port.id}`}
              paper={this.props.paper}
              way={port.portType}
              elementId={this.props.entity.id}
              className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
              scope={port.portGroup}/>
      );
    });
  }

  render() {
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">URL</div>
              <div className="canvas-element__properties__property-value">
                {getPublicEndpointUrl(this.props.entity.id, this.props.entity.path)}
              </div>
            </div>
            <div className="canvas-element__properties__property editable-only">
              <div className="canvas-element__properties__property-title">Path</div>
              <div className="canvas-element__properties__property-value">
                <Input className="canvas-element__input canvas-element__input--property"
                       value={this.props.entity.path}
                       name="path"/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
