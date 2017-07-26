import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
import cs from 'classnames';
import {EntityProperties} from '../../../../lunchbadger-ui/src';
import updateDataSource from '../../actions/CanvasElements/DataSource/update';
import removeDataSource from '../../actions/CanvasElements/DataSource/remove';
import removeEntity from '../../actions/CanvasElements/remove';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Input = LunchBadgerCore.components.Input;
const Port = LunchBadgerCore.components.Port;

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  update(model) {
    const validations = this.validate(model);
    if (validations.isValid) {
      updateDataSource(this.props.entity.id, model);
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

  removeEntity = () => {
    const {entity} = this.props;
    removeDataSource(entity);
    removeEntity(entity);
  }

  renderPorts() {
    return this.props.entity.metadata.ports.map((port) => {
      return (
        <Port
          key={`port-${port.portType}-${port.id}`}
          paper={null}
          way={port.portType}
          elementId={this.props.entity.data.id}
          scope={port.portGroup}
        />
      );
    });
  }

  renderMainProperties = () => {
    const {
      entity: {data: {connector, url, database, username, password}},
      validations: {data},
      entityDevelopment,
      onResetField,
    } = this.props;
    if (connector === 'memory') {
      return null;
    }
    const mainProperties = [
      {
        name: 'url',
        title: 'URL',
        value: url,
        invalid: data.url,
        onBlur: this.handleFieldChange('url')
      },
      {
        name: 'database',
        title: 'database',
        value: database,
        invalid: data.database,
        onBlur: this.handleFieldChange('database')
      },
      {
        name: 'username',
        title: 'username',
        value: username,
        invalid: data.username,
        onBlur: this.handleFieldChange('username'),
      },
      {
        name: 'password',
        title: 'password',
        value: password,
        invalid: data.password,
        onBlur: this.handleFieldChange('password'),
        password: true,
        contextual: 'Password should be at least 6 chars long',
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

// const mapDispatchToProps = dispatch => ({
// });

// export default connect(null, mapDispatchToProps)(CanvasElement(DataSource));
export default CanvasElement(DataSource);
