import ModelProperty from '../models/ModelProperty';

export default (model, entity, properties, stateProperties) => {
  const rootProperties = [];
  const props = {};
  const idMapping = {};
  Object.keys(model.properties || {}).forEach((key) => {
    const property = model.properties[key];
    property.name = property.name.trim();
    if (property.name.length === 0) return;
    const prop = ModelProperty.create({
      ...property,
      lunchbadgerId: property.id,
    });
    idMapping[prop.id] = property.id;
    props[property.id] = prop;
    const [parentId] = key.split('/');
    if (['array', 'object', 'geopoint'].includes(prop.type)) {
      if (prop.default_ !== undefined && typeof prop.default_ !== 'object') {
        prop.default_ = JSON.parse(prop.default_);
      }
      prop.isNull = true;
      prop.type = prop.type === 'object' ? {} : [];
    }
    if (parentId !== '') {
      const parent = props[parentId];
      if (!parent) return;
      if (parent.isNull) {
        delete parent.isNull;
      }
      if (Array.isArray(parent.type)) {
        parent.type.push(prop);
      } else {
        parent.type[prop.name] = prop;
      }
    } else {
      rootProperties.push(property.id);
    }
  });
  const fallbackProperties = {};
  stateProperties.forEach((property) => {
    const prop = ModelProperty.create(property);
    fallbackProperties[prop.id] = prop;
    if (prop.type === 'object') {
      prop.type = {};
    }
    if (prop.type === 'array') {
      prop.type = [];
    }
    if (prop.parentId !== '' && fallbackProperties[prop.parentId] && prop.name !== '') {
      if (Array.isArray(fallbackProperties[prop.parentId].type)) {
        fallbackProperties[prop.parentId].type.push(prop);
      } else {
        fallbackProperties[prop.parentId].type[prop.name] = prop;
      }
    }
  });
  Object.keys(props).forEach((key) => {
    const prop = props[key];
    if (prop.isNull) {
      prop.type = fallbackProperties[key].type;
      delete prop.isNull;
    }
    prop.attach(entity);
    if (rootProperties.includes(key)) {
      properties.push(prop);
    }
  });
}
