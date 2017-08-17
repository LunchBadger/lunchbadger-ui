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
    return this.props.entity.ports.map((port, idx) => {
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

  getMainProperty = (name) => {
    const {entity, validations: {data}} = this.props;
    const prop = {
      name,
      title: name,
      value: entity[name].toString(),
      invalid: data[name],
      onBlur: this.handleFieldChange(name),
    };
    if (name === 'password') {
      prop.password = true;
      prop.contextual = 'Password should be at least 6 chars long';
    }
    return prop;
  }

  renderMainProperties = () => {
    const {
      entity: {connector},
      entityDevelopment,
      onResetField,
    } = this.props;
    if (connector === 'memory') return null;
    const isMySql = connector === 'mysql';
    const mainProperties = [];
    if (isMySql) {
      mainProperties.push(this.getMainProperty('host'));
      mainProperties.push(this.getMainProperty('port'));
    } else {
      mainProperties.push(this.getMainProperty('url'));
    }
    mainProperties.push(this.getMainProperty('database'));
    mainProperties.push(this.getMainProperty(isMySql ? 'user' : 'username'));
    mainProperties.push(this.getMainProperty('password'));
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
