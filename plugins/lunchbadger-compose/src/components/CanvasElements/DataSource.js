import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
import {EntityProperties} from '../../../../lunchbadger-ui/src';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
const Port = LunchBadgerCore.components.Port;

class DataSource extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value, evt);
    }
  }

  renderPorts() {
    return this.props.entity.metadata.ports.map((port, idx) => {
      return (
        <Port
          key={idx}
          way={port.portType}
          elementId={port.id}
          scope={port.portGroup}
        />
      );
    });
  }

  renderMainProperties = () => {
    const {
      entity: {connector, url, database, username, password},
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
