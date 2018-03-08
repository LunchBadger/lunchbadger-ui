import React, {Component} from 'react';
import PropTypes from 'prop-types';
import slug from 'slug';
import cs from 'classnames';
import _ from 'lodash';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import {runtimeMapping, runtimeOptions} from '../../utils';
import FunctionTriggers from './Subelements/FunctionTriggers';
import './Function.scss';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;

class Function_ extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  processModel = model => this.props.entity.processModel(model);

  renderPorts = () => {
    return this.props.entity.ports.map((port) => (
      <Port
        key={`port-${port.portType}-${port.id}`}
        way={port.portType}
        elementId={port.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

  renderMainProperties = () => {
    const {entity, onResetField} = this.props;
    let runtime = runtimeOptions[0];
    const {service} = entity;
    if (service && service.serverless) {
      runtime = runtimeMapping(service.serverless.provider.runtime).lb;
    }
    const mainProperties = [
      {
        name: 'runtime',
        title: 'Runtime',
        value: runtime,
        options: runtimeOptions.map(label => ({label, value: label})),
        fake: entity.loaded,
      },
    ];
    mainProperties[0].onResetField = onResetField;
    return <EntityProperties properties={mainProperties} />;
  }

  render() {
    const {multiEnvIndex, nested, entity: {id, loaded}} = this.props;
    return (
      <div className={cs('Function', {nested, 'multi': multiEnvIndex > 0})}>
        {!nested && this.renderPorts()}
        {this.renderMainProperties()}
        {loaded && (
          <EntitySubElements
            title="Triggers"
            onAdd={this.onAddRootProperty}
            main
          >
            <FunctionTriggers id={id} />
          </EntitySubElements>
        )}
      </div>
    );
  }
}

export default CanvasElement(Function_);
