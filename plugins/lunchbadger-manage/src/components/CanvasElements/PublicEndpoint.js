import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {EntityProperties} from '../../../../lunchbadger-ui/src';
import getPublicEndpointUrl from '../../utils/getPublicEndpointUrl';
import updatePublicEndpoint from '../../actions/CanvasElements/PublicEndpoint/update';
import removeEntity from '../../actions/CanvasElements/remove';

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

  removeEntity = () => removeEntity(this.props.entity);

  onPathChange = event => this.setState({path: event.target.value});

  renderPorts() {
    return this.props.entity.metadata.ports.map((port, idx) => (
      <Port
        key={idx}
        way={port.portType}
        elementId={port.id}
        className={`port-${this.props.entity.metadata.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

  renderMainProperties = () => {
    const {entity, validations: {data}, entityDevelopment, onResetField} = this.props;
    const mainProperties = [
      {
        name: 'url',
        title: 'URL',
        value: getPublicEndpointUrl(entity.id, this.state.path),
        fake: true,
      },
      {
        name: 'path',
        title: 'path',
        value: entity.path,
        invalid: data.path,
        onChange: this.onPathChange,
        onBlur: this.handleFieldChange('path'),
        editableOnly: true,
      },
    ];
    mainProperties[0].isDelta = this.state.path !== entityDevelopment.path;
    mainProperties[0].onResetField = () => onResetField('path');
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

export default CanvasElement(PublicEndpoint);
