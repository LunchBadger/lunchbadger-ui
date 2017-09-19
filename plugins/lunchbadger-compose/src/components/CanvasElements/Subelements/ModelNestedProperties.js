import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {CSSTransitionGroup} from 'react-transition-group';
import ModelProperty from './ModelProperty';
import ModelPropertyCollapsed from './ModelPropertyCollapsed';

const CollapsableDetails = LunchBadgerCore.components.CollapsableDetails;

class ModelNestedProperties extends Component {
  constructor(props) {
    super(props);
    this.nestedDOM = {};
  }

  onAddProperty = (parentId) => () => {
    this.nestedDOM[parentId] && this.nestedDOM[parentId].toggleCollapse(false);
    this.props.onAddProperty(parentId)();
  }

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
      nested,
      index,
    } = this.props;
    const filteredProperties = properties.filter(property => property.parentId === parentId);
    const titleLabel = `${title} ${path !== '' ? ' for ' : ''} ${path} (${filteredProperties.length})`;
    return (
      <CSSTransitionGroup
        transitionName="propertyTransition"
        transitionEnterTimeout={800}
        transitionLeaveTimeout={800}
      >
        {filteredProperties.map((property, idx) => {
          const isNested = ['array', 'object'].includes(property.type);
          return (
            <ModelPropertyCollapsed
              ref={(r) => {this.nestedDOM[property.id] = r;}}
              key={property.id}
              level={level}
              collapsable={isNested}
              nested={isNested ?
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
                  nested={nested}
                  index={index}
                /> : null
              }
            >
              <ModelProperty
                idx={idx}
                addAction={this.onAddProperty}
                propertiesCount={filteredProperties.length}
                onRemove={onRemoveProperty}
                property={property}
                onPropertyTypeChange={onPropertyTypeChange}
                parentId={parentId}
                nested={nested}
                index={index}
              />
            </ModelPropertyCollapsed>
          )
        })}
      </CSSTransitionGroup>
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
