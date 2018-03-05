import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import slug from 'slug';
import _ from 'lodash';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  FilesEditor,
} from '../../../../../lunchbadger-ui/src';
import runtimeOptions from '../../../utils/runtimeOptions';
import FunctionTriggers from '../../CanvasElements/Subelements/FunctionTriggers';
import './FunctionDetails.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

const editorCodeLanguages = {
  node: 'javascript',
  python: 'python',
  java: 'java',
  'c#': 'csharp',
};

const getEditorCodeLanguage = str => editorCodeLanguages[str.split(' ')[0].toLowerCase()];

class FunctionDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.onPropsUpdate = (props = this.props, callback) => this.setState(this.initState(props), callback);
  }

  componentWillReceiveProps(nextProps) {
    const {id} = this.props.entity;
    if (nextProps.entity.id !== id) {
      this.onPropsUpdate(nextProps);
    }
  }

  initState = (props = this.props) => {
    const {contextPath, name, runtime} = props.entity;
    return {
      changed: false,
      contextPath,
      contextPathDirty: slug(name, {lower: true}) !== contextPath,
      editorCodeLanguage: getEditorCodeLanguage(runtime),
    };
  };

  processModel = model => this.props.entity.processModel(model);

  discardChanges = callback => {
    this.onPropsUpdate(this.props, callback);
  };

  handleRuntimeChange = value => this.setState({editorCodeLanguage: getEditorCodeLanguage(value)});

  renderDetailsSection = () => {
    const {entity} = this.props;
    const fields = [
      {
        title: 'Context Path',
        name: 'http[path]',
        value: entity.contextPath,
      },
      {
        title: 'Runtime',
        name: 'runtime',
        value: entity.runtime,
        options: runtimeOptions.map(label => ({label, value: label})),
        onChange: this.handleRuntimeChange,
        fake: entity.loaded,
      },
    ];
    return (
      <div className="panel__details">
        {fields.map(item => <EntityProperty key={item.name} {...item} placeholder=" " />)}
      </div>
    );
  };

  renderTriggersSection = () => <FunctionTriggers id={this.props.entity.id} details />;

  handleFunctionCodeChange = () => this.setState({changed: true}, () => this.props.parent.checkPristine());

  renderFunctionCodeSection = () => {
    const {files} = this.props.entity.service;
    const {editorCodeLanguage} = this.state;
    return (
      <FilesEditor
        lang={editorCodeLanguage}
        onChange={this.handleFunctionCodeChange}
        files={files}
      />
    );
  };

  render() {
    const sections = [
      {title: 'Details'},
      {title: 'Triggers'},
      {title: 'Function Code', render: 'FunctionCode'},
    ];
    return (
      <div className="FunctionDetails">
        {sections.map(({title, render}) => (
          <CollapsibleProperties
            key={title}
            bar={<EntityPropertyLabel>{title}</EntityPropertyLabel>}
            collapsible={this[`render${render || title}Section`]()}
            barToggable
            defaultOpened
          />
        ))}
      </div>
    );
  }
}

export default BaseDetails(FunctionDetails);
