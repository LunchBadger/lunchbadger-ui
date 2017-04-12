import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import updatePrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/update';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;

class PrivateEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    const validations = this.validate(model);
    if (validations.isValid) {
      updatePrivateEndpoint(this.props.entity.id, model);
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
    if (model.url === '') validations.data.url = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
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
            <div className={cs('canvas-element__properties__property', {['invalid']: data.url})}>
              <div className="canvas-element__properties__property-title">URL</div>
              <div className="canvas-element__properties__property-value">
                <span className="hide-while-edit">
                  {this.props.entity.url || 'Enter URL here'}
                </span>
                <Input className="canvas-element__input canvas-element__input--property editable-only"
                       value={this.props.entity.url}
                       placeholder="Enter URL here"
                       name="url"
                       handleBlur={this.handleFieldChange('url')}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CanvasElement(PrivateEndpoint);
