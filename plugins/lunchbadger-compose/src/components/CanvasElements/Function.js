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
    paper: PropTypes.object,
  };

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  renderPorts = () => {
    const {entity} = this.props;
    return entity.ports.map((port) => (
      <Port
        key={`port-${port.portType}-${port.id}`}
        way={port.portType}
        elementId={port.id}
        className={`port-${entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
        gaType={entity.gaType}
      />
    ));
  }

  renderMainProperties = () => {
    const {entity, onResetField} = this.props;
    let runtime = runtimeOptions.find(({defaultSelected}) => defaultSelected).value;
    const {service} = entity;
    if (service && service.serverless) {
      runtime = runtimeMapping(service.serverless.provider.runtime).lb;
    }
    const mainProperties = [
      {
        name: 'runtime',
        title: 'Runtime',
        value: runtime,
        options: runtimeOptions,
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
