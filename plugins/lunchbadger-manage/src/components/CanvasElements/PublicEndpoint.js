import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
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

    this.state = {
      path: props.entity.path
    };
  }

  update(model) {
    const validations = this.validate(model);
    if (validations.isValid) {
      updatePublicEndpoint(this.props.entity.id, model);
    }
    return validations;
  }

  validate = (model) => {
    const validations = {
      isValid: true,
      data: {},
    }
    const messages = {
      empty: 'This field cannot be empty',
    }
    if (model.path === '') validations.data.path = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.parent.state.editable) {
      this.setState({path: nextProps.entity.path});
    }
  }

  onPathChange(event) {
    this.setState({path: event.target.value});
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
    const {validations: {data}} = this.props;
    return (
      <div>
        <div>
          {this.renderPorts()}
        </div>
        <div className="canvas-element__properties">
          <div className="canvas-element__properties__table">
            <div className="canvas-element__properties__property">
              <div className="canvas-element__properties__property-title">URL</div>
              <div className="canvas-element__properties__property-value canvas-element__properties__property-fake">
                {getPublicEndpointUrl(this.props.entity.id, this.state.path)}
              </div>
            </div>
            <div className={cs('canvas-element__properties__property', 'editable-only', {['invalid']: data.path})}>
              <div className="canvas-element__properties__property-title">Path</div>
              <div className="canvas-element__properties__property-value">
                <Input className="canvas-element__input canvas-element__input--property"
                       value={this.props.entity.path}
                       placeholder="Enter path here"
                       name="path"
                       handleChange={this.onPathChange.bind(this)}
                       handleBlur={this.handleFieldChange('path')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PublicEndpoint);
