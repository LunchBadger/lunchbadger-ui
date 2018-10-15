import React, {PureComponent} from 'react';
import cs from 'classnames';
import schemas from '../../../../utils/dataSourceSchemas';
import './styles.scss';

// TODO: move GatewayPolicyAction component from manage plugin to core
const {components: {GatewayPolicyAction}} = LunchBadgerManage;

export default class FlexibleProperties extends PureComponent {
  render() {
    const {entity, plain, onStateChange, validations} = this.props;
    const {connector} = entity;
    const properties = entity.connectorProperties();
    const schema = schemas[connector];
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
