import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {EntityProperties} from '../../../../lunchbadger-ui/src';
import updatePrivateEndpoint from '../../actions/CanvasElements/PrivateEndpoint/update';
import removeEntity from '../../actions/CanvasElements/remove';

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

  removeEntity = () => removeEntity(this.props.entity);

  renderPorts() {
    return null;
    return this.props.entity.ports.map(port => (
      <Port
        key={`port-${port.portType}-${port.id}`}
        paper={this.props.paper}
        way={port.portType}
        elementId={this.props.entity.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

  renderMainProperties = () => {
    const {entity: {data: {url}}, validations: {data}, entityDevelopment, onResetField} = this.props;
    const mainProperties = [
      {
        name: 'url',
        title: 'URL',
        value: url,
        invalid: data.url,
        onBlur: this.handleFieldChange('url'),
      },
    ];
    mainProperties.forEach((item, idx) => {
      mainProperties[idx].isDelta = item.value !== entityDevelopment[item.name];
      mainProperties[idx].onResetField = onResetField;
    });
    return <EntityProperties properties={mainProperties} />;
  }

  render() {
    return (
      <div>
        {this.renderPorts()}
        {this.renderMainProperties()}
      </div>
    );
  }
}

export default CanvasElement(PrivateEndpoint);
