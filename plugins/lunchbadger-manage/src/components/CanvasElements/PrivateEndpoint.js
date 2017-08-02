import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EntityProperties} from '../../../../lunchbadger-ui/src';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;

class PrivateEndpoint extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    paper: PropTypes.object
  };

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

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
    const {entity: {url}, validations: {data}, entityDevelopment, onResetField} = this.props;
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
