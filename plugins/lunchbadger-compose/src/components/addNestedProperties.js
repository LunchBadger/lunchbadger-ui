import ModelProperty from '../models/ModelProperty';

const addNestedProperties = (entity, props, properties, parentId, counter = -1) => {
  properties
  .sort(entity.sortByItemOrder)
  .forEach((property) => {
    counter += 1;
    property.itemOrder = property.hasOwnProperty('itemOrder') ? property.itemOrder : counter;
    const prop = ModelProperty.create(property);
    prop.parentId = parentId;
    prop.attach(entity);
    props.push(prop);
    if (typeof prop.type === 'object') {
      const nestedProperties = [];
      Object.keys(prop.type).forEach((key) => {
        nestedProperties.push({
          name: prop.type[key].name || key,
          ...prop.type[key],
        });
      });
      prop.type = Array.isArray(prop.type) ? 'array' : 'object';
      addNestedProperties(entity, props, nestedProperties, prop.id, counter);
    }
  });
}

export default addNestedProperties;
