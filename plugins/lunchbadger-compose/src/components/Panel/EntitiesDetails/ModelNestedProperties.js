import React, {Component} from 'react';
import ModelPropertyDetails from './ModelPropertyDetails';
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class ModelNestedProperties extends Component {
  renderNested = (propertyName, type) => {
    if (typeof type !== 'object') return null;
    const facetName = 'server';
    const modelId = `${facetName}.Customer`;
    const nested = Object.keys(type).map(name => ({
      facetName,
      id: `${modelId}.${name}`,
      modelId,
      name,
      type: type[name].type,
    }));
    const {onAddProperty, onRemoveProperty} = this.props;
    return (
      <tr>
        <td colSpan={7}>
          <ModelNestedProperties
            title="Nested properties"
            path={propertyName}
            collapsed
            properties={nested}
            onAddProperty={onAddProperty}
            onRemoveProperty={onRemoveProperty}
          />
        </td>
      </tr>
    );
  }

  renderProperties() {
    const {title, path, properties, onAddProperty, onRemoveProperty} = this.props;
    return properties.map((property, index) => {
      return (
        <tbody key={`property-${property.id}`}>
          <ModelPropertyDetails
            index={index}
            addAction={onAddProperty}
            propertiesCount={properties.length}
            onRemove={onRemoveProperty}
            property={property}
          />
          {this.renderNested(`${path !== '' ? `${path} ⇨` : ''} ${property.name}`, property.type)}
        </tbody>
      );
    });
  }

  render() {
    const {title, path, collapsed, properties, onAddProperty} = this.props;
    const titleLabel = `${title} ${path !== '' ? ' for ' : ''} ${path} (${properties.length})`;
    return (
      <CollapsableDetails collapsed={collapsed} title={titleLabel}>
        <table className="details-panel__table" ref="properties">
          <thead>
          <tr>
            <th>Name</th>
            <th>Data type</th>
            <th>Default Value</th>
            <th>Required</th>
            <th>Is index</th>
            <th>
              Notes
              <a onClick={onAddProperty} className="details-panel__add">
                <i className="fa fa-plus"/>
                Add property
              </a>
            </th>
            <th className="details-panel__table__cell details-panel__table__cell--empty"/>
          </tr>
          </thead>
          {this.renderProperties()}
        </table>
      </CollapsableDetails>
    );
  }
}

export default ModelNestedProperties;
