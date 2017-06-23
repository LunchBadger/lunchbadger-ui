const ModelProperty = LunchBadgerManage.models.ModelProperty;

const addNestedProperties = (entity, props, properties, parentId) => {
  properties.forEach((property) => {
    const prop = ModelProperty.create(property);
    prop.parentId = parentId;
    prop.attach(entity);
    props.push(prop);
    if (typeof prop.type === 'object') {
      const nestedProperties = [];
      Object.keys(prop.type).forEach((key) => {
        nestedProperties.push({
          name: key,
          ...prop.type[key],
        });
      });
      prop.type = Array.isArray(prop.type) ? 'array' : 'object';
      addNestedProperties(entity, props, nestedProperties, prop.id);
    }
  });
}

export default addNestedProperties;
