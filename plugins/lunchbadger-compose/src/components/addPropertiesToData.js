const ModelProperty = LunchBadgerManage.models.ModelProperty;

export default (model, entity, properties, stateProperties) => {
  const rootProperties = [];
  const props = {};
  const idMapping = {};
  Object.keys(model.properties).forEach((key) => {
    const property = model.properties[key];
    if (property.name.trim().length === 0) return;
    const prop = ModelProperty.create(property);
    idMapping[prop.id] = property.id;
    props[property.id] = prop;
    const [parentId, idx] = key.split('/');
    if (prop.type === 'object') {
      prop.type = null;
    }
    if (parentId !== '') {
      const parent = props[parentId];
      if (parent.type === null) {
        parent.type = {};
      }
      parent.type[prop.name] = prop;
    } else {
      rootProperties.push(property.id);
    }
  });
  const fallbackProperties = {};
  stateProperties.forEach((property) => {
    const prop = ModelProperty.create(property);;
    fallbackProperties[prop.id] = prop;
    if (prop.type === 'object') {
      prop.type = {};
    }
    if (prop.parentId !== '' && fallbackProperties[prop.parentId]) {
      fallbackProperties[prop.parentId].type[prop.name] = prop;
    }
  });
  Object.keys(props).forEach((key) => {
    const prop = props[key];
    if (prop.type === null) {
      prop.type = fallbackProperties[key].type;
    }
    prop.attach(entity);
    if (rootProperties.includes(key)) {
      properties.push(prop);
    }
  });
}
