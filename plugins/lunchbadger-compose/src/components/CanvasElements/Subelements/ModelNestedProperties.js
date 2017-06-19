import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ModelProperty from './ModelProperty';
import ModelPropertyCollapsed from './ModelPropertyCollapsed';

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
      level,
    } = this.props;
    const filteredProperties = properties.filter(property => property.parentId === parentId);
    const titleLabel = `${title} ${path !== '' ? ' for ' : ''} ${path} (${filteredProperties.length})`;
    return (
      <div>
        {filteredProperties.map((property, index) => (
          <ModelPropertyCollapsed
            key={index}
            level={level}
            collapsable={property.type === 'object'}
            nested={property.type === 'object' ?
              <ModelNestedProperties
                title="Nested properties"
                path={`${path !== '' ? `${path} ⇨` : ''} ${property.name}`}
                collapsed
                properties={properties}
                onAddProperty={onAddProperty}
                onRemoveProperty={onRemoveProperty}
                onPropertyTypeChange={onPropertyTypeChange}
                parentId={property.id}
                level={level + 1}
              /> : null
            }
          >
            <ModelProperty
              index={index}
              addAction={onAddProperty}
              propertiesCount={filteredProperties.length}
              onRemove={onRemoveProperty}
              property={property}
              onPropertyTypeChange={onPropertyTypeChange}
              parentId={parentId}
            />
            {/*property.type === 'object' && (
              <ModelNestedProperties
                title="Nested properties"
                path={`${path !== '' ? `${path} ⇨` : ''} ${property.name}`}
                collapsed
                properties={properties}
                onAddProperty={onAddProperty}
                onRemoveProperty={onRemoveProperty}
                onPropertyTypeChange={onPropertyTypeChange}
                parentId={property.id}
                level={level + 1}
              />
            )*/}
          </ModelPropertyCollapsed>
        ))}
      </div>
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
  level: PropTypes.number,
};

ModelNestedProperties.defaultProps = {
  parentId: '',
  collapsed: false,
  level: 0,
};

export default ModelNestedProperties;
