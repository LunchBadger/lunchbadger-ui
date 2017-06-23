import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ModelPropertyDetails from './ModelPropertyDetails';
const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class ModelNestedProperties extends Component {
  render() {
    const {
      title,
      path,
      collapsed,
      properties,
      onAddProperty,
      onRemoveProperty,
      onPropertyTypeChange,
      parentId,
    } = this.props;
    const filteredProperties = properties.filter(property => property.parentId === parentId);
    const titleLabel = `${title} ${path !== '' ? ' for ' : ''} ${path} (${filteredProperties.length})`;
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
              <a onClick={onAddProperty(parentId)} className="details-panel__add">
                <i className="fa fa-plus"/>
                Add property
              </a>
            </th>
            <th className="details-panel__table__cell details-panel__table__cell--empty"/>
          </tr>
          </thead>
          {filteredProperties.map((property, index) => {
            return (
              <tbody key={`property-${property.id}`}>
                <ModelPropertyDetails
                  index={index}
                  addAction={onAddProperty}
                  propertiesCount={filteredProperties.length}
                  onRemove={onRemoveProperty}
                  property={property}
                  onPropertyTypeChange={onPropertyTypeChange}
                  parentId={parentId}
                />
                {['array', 'object'].includes(property.type) && (
                  <tr>
                    <td colSpan={7}>
                      <ModelNestedProperties
                        title="Nested properties"
                        path={`${path !== '' ? `${path} ⇨` : ''} ${property.name}`}
                        collapsed
                        properties={properties}
                        onAddProperty={onAddProperty}
                        onRemoveProperty={onRemoveProperty}
                        onPropertyTypeChange={onPropertyTypeChange}
                        parentId={property.id}
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            );
          })}
        </table>
      </CollapsableDetails>
    );
  }
}

ModelNestedProperties.propTypes = {
  parentId: PropTypes.string,
  title: PropTypes.string,
  path: PropTypes.string,
  properties: PropTypes.array,
  onAddProperty: PropTypes.func,
  onRemoveProperty: PropTypes.func,
  onPropertyTypeChange: PropTypes.func,
  collapsed: PropTypes.bool,
};

ModelNestedProperties.defaultProps = {
  parentId: '',
  collapsed: false,
};

export default ModelNestedProperties;
