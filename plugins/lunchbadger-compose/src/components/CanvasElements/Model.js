import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import ModelNestedProperties from '../CanvasElements/Subelements/ModelNestedProperties';
import addNestedProperties from '../addNestedProperties';
import ModelProperty from '../../models/ModelProperty';
import './Model.scss';

const {
  components: {Port, CanvasElement},
  UI: {
    EntityProperties,
    EntitySubElements,
    getDefaultValueByType,
  },
} = LunchBadgerCore;

class Model extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired,
    nested: PropTypes.bool,
  };

  static defaultProps = {
    nested: false,
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    const stateFromStores = (newProps) => {
      const data = {
        properties: [],
      };
      addNestedProperties(props.entity, data.properties, newProps.entity.properties.slice(), '');
      return data;
    };
    this.state = {
      ...this.initState(props),
      ...stateFromStores(props),
    };
    this.onPropsUpdate = (props = this.props, callback) => {
      this.setState({
        ...this.initState(props),
        ...stateFromStores(props),
      }, callback);
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entity !== this.props.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  initState = (props = this.props) => {
    const {
      http_path,
      plural,
      name,
      contextPathFallback,
    } = props.entity;
    return {
      name,
      http_path,
      plural,
      contextPath: contextPathFallback({http_path, plural, name}),
    };
  };

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  processModel = model => this.props.entity.processModel(model, this.state.properties);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  };

  updateName = event => {
    const name = event.target.value;
    const {pluralized, contextPathFallback} = this.props.entity;
    const {http_path, plural} = this.state;
    const state = {http_path, name};
    const pluralDirty = plural !== pluralized(this.state.name);
    state.plural = pluralDirty ? plural : pluralized(name);
    state.contextPath = contextPathFallback(state);
    this.setState(state);
  };

  onAddItem = (collection, item) => {
    const items = this.state[collection];
    items.push(item);
    this.setState({
      [collection]: items
    });
  };

  onRemoveItem = (collection, item) => {
    const items = this.state[collection];
    _.remove(items, function (i) {
      if (item.id) {
        return i.id === item.id;
      }
      return i.name === item.name;
    });
    this.setState({
      [collection]: items
    });
  };

  onAddProperty = (parentId) => () => {
    const itemOrder = 1 + Math.max(-1, ...this.state.properties
      .filter(p => p.parentId === parentId)
      .map(p => p.itemOrder));
    this.onAddItem('properties', ModelProperty.create({
      parentId,
      type: 'string',
      itemOrder,
    }));
  };

  onAddRootProperty = () => {
    this.onAddProperty('')();
    setTimeout(() => {
      const input = Array.from(this.refs.properties.querySelectorAll('.EntityProperty__field--input input')).slice(-1)[0];
      input && input.focus();
    });
  };

  onRemoveProperty = (property) => this.onRemoveItem('properties', property);

  onPropertyTypeChange = (id, type) => {
    const properties = [...this.state.properties];
    const prop = properties.find(prop => prop.id === id);
    const newProps = {type};
    if (prop.withDefault) {
      newProps.default_ = getDefaultValueByType(type);
    }
    Object.assign(prop, newProps);
    this.setState({properties});
  };

  onReorder = parentId => ({oldIndex, newIndex}) => {
    const {entity} = this.props;
    const properties = entity.reorderProperties(this.state.properties, oldIndex, newIndex, parentId);
    if (properties) {
      this.setState({properties});
    }
  };

  renderPorts = () => {
    const {entity} = this.props;
    const {ports, constructor: {type}, gaType, base} = entity;
    const isStorageDefined = Object.values(this.context.store.getState().entities.dataSources)
      .filter(ds => ds.loaded && ds.connector === 'storage')
      .length > 0;
    if (base === 'Model' && !isStorageDefined) return null;
    return ports.map(({portType, id, portGroup}) => (
      <Port
        key={`port-${portType}-${id}`}
        way={portType}
        elementId={id}
        className={`port-${type} port-${portGroup}`}
        scope={portGroup}
        gaType={gaType}
      />
    ));
  };

  renderProperties = () => {
    const {nested, index} = this.props;
    return (
      <ModelNestedProperties
        title="Properties"
        path=""
        properties={this.state.properties}
        onAddProperty={this.onAddProperty}
        onRemoveProperty={this.onRemoveProperty}
        onPropertyTypeChange={this.onPropertyTypeChange}
        onReorder={this.onReorder}
        nested={nested}
        index={index}
      />
    );
  };

  renderMainProperties = () => {
    const {nested, index} = this.props;
    const {plural, contextPath} = this.state;
    const mainProperties = [
      {
        name: 'tmp[contextPath]',
        title: 'context path',
        value: contextPath,
        fake: true,
      },
      {
        name: nested ? `models[${index}][plural]` : 'plural',
        title: 'plural',
        value: plural,
        hidden: true,
      }
    ];
    return <EntityProperties properties={mainProperties} />;
  };

  render() {
    const {multiEnvIndex, nested} = this.props;
    return (
      <div className={cs('Model', {nested, 'multi': multiEnvIndex > 0})}>
        {!nested && this.renderPorts()}
        {this.renderMainProperties()}
        <EntitySubElements
          title="Properties"
          onAdd={this.onAddRootProperty}
          main
        >
          <div className="Model__properties" ref="properties">
            {this.renderProperties()}
          </div>
        </EntitySubElements>
      </div>
    );
  }
}

export default CanvasElement(Model);
