import React, {PureComponent} from 'react';
import cs from 'classnames';
import schemas from '../../../../utils/dataSourceSchemas';
import './styles.scss';

// TODO: move GatewayPolicyAction component from manage plugin to core
const {components: {GatewayPolicyAction}} = LunchBadgerManage;

export default class FlexibleProperties extends PureComponent {

  handleFieldChange = field => (event) => {
    const {onFieldUpdate} = this.props;
    if (typeof onFieldUpdate === 'function') {
      onFieldUpdate(field, event.target.value, event);
    }
  };

  transformSchema = (schema) => {
    const data = {...schema};
    const {properties, required} = data;
    required.forEach((key) => {
      properties[key].props = {onBlur: this.handleFieldChange(`LunchBadger[${key}]`)};
    });
    return data;
  };

  render() {
    const {entity, plain, onStateChange, validations} = this.props;
    const {connector} = entity;
    const properties = entity.connectorProperties();
    const schema = this.transformSchema(schemas[connector]);
    const {canvas} = schema;
    const prefix = 'LunchBadger';
    return (
      <div className={cs('DS', {plain, details: !plain})}>
        <GatewayPolicyAction
          action={properties}
          schemas={schema}
          prefix={prefix}
          tmpPrefix={prefix}
          onChangeState={onStateChange}
          horizontal
          validations={validations}
          visibleParameters={plain ? canvas : []}
          collapsibleTitle={plain ? '' : 'Properties'}
          collapsibleDocsLink={`DATASOURCE_${connector.toUpperCase()}_PROPERTIES`}
          withPlaceholders
          entry={entity}
        />
      </div>
    );
  }
}
