import React, {Component} from 'react';
import PropTypes from 'prop-types';
// import {connect} from 'react-redux';
import _ from 'lodash';
import {EntityProperties, EntitySubElements} from '../../../../lunchbadger-ui/src';
import ModelNestedProperties from '../CanvasElements/Subelements/ModelNestedProperties';
import slug from 'slug';
import addPropertiesToData from '../addPropertiesToData';
import addNestedProperties from '../addNestedProperties';
import ModelProperty from '../../models/_modelProperty';
import './Model.scss';

const Port = LunchBadgerCore.components.Port;
const CanvasElement = LunchBadgerCore.components.CanvasElement;

class Model extends Component {
  constructor(props) {
    super(props);
    const stateFromStores = (newProps) => {
      const data = {
        properties: newProps.entity.privateModelProperties ? newProps.entity.privateModelProperties.slice() : [],
      };
      if (!newProps.entity.privateModelProperties) {
         addNestedProperties(props.entity, data.properties, newProps.entity.properties.slice(), '');
      }
      return data;
    };
    this.state = {
      ...this.initState(props),
      ...stateFromStores(props),
    };
    this.onStoreUpdate = (props = this.props) => {
      this.setState({...stateFromStores(props)});
    };
  }

  // componentDidMount() {
  //   PrivateStore.addChangeListener(this.onStoreUpdate);
  // }
  //
  componentWillReceiveProps(nextProps) {
    if (nextProps.entity.properties !== this.props.entity.properties) {
      this.onStoreUpdate(nextProps);
    }
    // if (!this.props.editable && nextProps.entity.contextPath !== this.state.contextPath) {
    //   this.setState(this.initState());
    // }
  }
  //
  // componentWillUnmount() {
  //   PrivateStore.removeChangeListener(this.onStoreUpdate);
  // }

  initState = (props = this.props) => {
    const {contextPath, name} = props.entity;
    return {
      contextPath,
      contextPathDirty: slug(name, {lower: true}) !== contextPath,
    };
  }

  discardChanges() {
    // revert properties
    // this.onStoreUpdate();
    // this.setState(this.initState());
  }

  // update(model) {
  //   const data = {
  //     properties: [],
  //   };
  //   addPropertiesToData(model, this.props.entity, data.properties, this.state.properties);
  //   const validations = this.validate(model);
  //   if (validations.isValid) {
  //     updateModel(
  //       this.props.entity.id,
  //       Object.assign(model, data),
  //     );
  //   }
  //   return validations;
  // }

  processModel = (model) => {
    const data = {
      properties: [],
    };
    addPropertiesToData(model, this.props.entity, data.properties, this.state.properties);
    return _.merge({}, model, data);
  }

  getEntityDiffProps = (model) => {
    if (!model) return null;
    const {name, contextPath} = this.props.entity.data;
    if (name === model.name && contextPath === model.contextPath) return null;
    return {
      ...model,
      name,
      contextPath,
    };
  }

  handleFieldChange = field => (evt) => {
    if (typeof this.props.onFieldUpdate === 'function') {
      this.props.onFieldUpdate(field, evt.target.value);
    }
  }

  updateName(event) {
    if (!this.state.contextPathDirty) {
      this.setState({contextPath: slug(event.target.value, {lower: true})});
    }
  }

  onAddItem = (collection, item) => {
    const items = this.state[collection];
    items.push(item);
    this.setState({
      [collection]: items
    });
  }

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
  }

  onAddProperty = (parentId) => () => {
    this.onAddItem('properties', ModelProperty.create({parentId}));
  }

  onAddRootProperty = () => {
    this.onAddProperty('')();
    setTimeout(() => {
      const input = Array.from(this.refs.properties.querySelectorAll('.EntityProperty__field--input input')).slice(-1)[0];
      input && input.focus();
    });
  }

  onRemoveProperty = (property) => {
    this.onRemoveItem('properties', property);
  }

  onPropertyTypeChange = (id, type) => {
    const properties = [...this.state.properties];
    properties.find(prop => prop.id === id).type = type;
    this.setState({properties});
  }

  updateContextPath = event => this.setState({contextPath: event.target.value, contextPathDirty: true});

  renderPorts = () => {
    return this.props.entity.ports.map((port, idx) => (
      <Port
        key={idx}
        way={port.portType}
        elementId={port.id}
        className={`port-${this.props.entity.constructor.type} port-${port.portGroup}`}
        scope={port.portGroup}
      />
    ));
  }

  renderProperties = () => {
    return (
      <ModelNestedProperties
        title="Properties"
        path=""
        properties={this.state.properties}
        onAddProperty={this.onAddProperty}
        onRemoveProperty={this.onRemoveProperty}
        onPropertyTypeChange={this.onPropertyTypeChange}
      />
    );
  }

  renderMainProperties = () => {
    const {validations: {data}, entityDevelopment, onResetField} = this.props;
    const {contextPath} = this.state;
    const mainProperties = [
      {
        name: 'http[path]',
        title: 'context path',
        value: contextPath,
        invalid: data.contextPath,
        onChange: this.updateContextPath,
        onBlur: this.handleFieldChange('contextPath'),
      }
    ];
    mainProperties[0].isDelta = contextPath !== entityDevelopment.contextPath;
    mainProperties[0].onResetField = onResetField;
    return <EntityProperties properties={mainProperties} />;
  }

  render() {
    return (
      <div>
        {this.renderPorts()}
        {this.renderMainProperties()}
        <EntitySubElements
          title="Properties"
          onAdd={this.onAddRootProperty}
          main
        >
          <div ref="properties">
            {this.renderProperties()}
          </div>
        </EntitySubElements>
      </div>
    );
  }
}

Model.propTypes = {
  entity: PropTypes.object.isRequired,
  paper: PropTypes.object,
};

// const mapDispatchToProps = dispatch => ({
// });

// export default connect(null, mapDispatchToProps)(CanvasElement(Model));
export default CanvasElement(Model);
