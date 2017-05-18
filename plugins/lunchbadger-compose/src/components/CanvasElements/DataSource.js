import React, {Component, PropTypes} from 'react';
import cs from 'classnames';
import {EntityProperties} from '../../../../lunchbadger-ui/src';
import updateDataSource from '../../actions/CanvasElements/DataSource/update';
import removeDataSource from '../../actions/CanvasElements/DataSource/remove';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;
const Port = LunchBadgerCore.components.Port;

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  static contextTypes = {
    projectService: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  update(model) {
    const validations = this.validate(model);
    if (validations.isValid) {
      updateDataSource(this.context.projectService, this.props.entity.id, model);
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
    if (model.name === '') validations.data.name = messages.empty;
    if (model.url === '') validations.data.url = messages.empty;
    if (model.database === '') validations.data.database = messages.empty;
    if (model.username === '') validations.data.username = messages.empty;
    if (model.password === '') validations.data.password = messages.empty;
    if (Object.keys(validations.data).length > 0) validations.isValid = false;
    return validations;
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value, evt);
    }
  }

  removeEntity() {
    removeDataSource(this.context.projectService, this.props.entity);
  }

  renderPorts() {
    return this.props.entity.ports.map((port) => {
      return (
        <Port
          key={`port-${port.portType}-${port.id}`}
          paper={this.props.paper}
          way={port.portType}
          elementId={this.props.entity.id}
          scope={port.portGroup}
        />
      );
    });
  }

  renderMainProperties = () => {
    const {entity, validations: {data}} = this.props;
    const mainProperties = [
      {
        name: 'url',
        title: 'URL',
        value: entity.url,
        invalid: data.url,
        onBlur: this.handleFieldChange('url')
      },
      {
        name: 'database',
        title: 'database',
        value: entity.database,
        invalid: data.database,
        onBlur: this.handleFieldChange('database')
      },
      {
        name: 'username',
        title: 'username',
        value: entity.username,
        invalid: data.username,
        onBlur: this.handleFieldChange('username'),
      },
      {
        name: 'password',
        title: 'password',
        value: entity.password,
        invalid: data.password,
        onBlur: this.handleFieldChange('password'),
        password: true,
        contextual: 'Password should be at least 6 chars long',
      },
    ];
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

export default CanvasElement(DataSource);
