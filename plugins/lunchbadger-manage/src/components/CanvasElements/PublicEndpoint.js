import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {EntityProperties} from '../../../../lunchbadger-ui/src';
import getPublicEndpointUrl from '../../utils/getPublicEndpointUrl';

const CanvasElement = LunchBadgerCore.components.CanvasElement;
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

  componentWillReceiveProps(nextProps) {
    if (this.props.entity.path !== nextProps.entity.path) {
      this.setState({path: nextProps.entity.path});
    }
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  onPathChange = event => this.setState({path: event.target.value});

  renderPorts() {
    return this.props.entity.ports.map((port, idx) => (
      <Port
        key={idx}
        way={port.portType}
        elementId={port.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
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
