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
import {runtimeMapping} from '../../../utils';
import FunctionTriggers from '../../CanvasElements/Subelements/FunctionTriggers';
import './FunctionDetails.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class FunctionDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  processModel = model => this.props.entity.processModel(model);

  onRemove = () => this.props.entity.beforeRemove(this.context.paper.getInstance());

  renderDetailsSection = () => {
    const {loaded: fake, service} = this.props.entity;
    const {serverless: {provider: {runtime}}} = service;
    const fields = [
      {
        title: 'Runtime',
        name: 'runtime',
        value: runtimeMapping(runtime).lb,
        fake,
      },
    ];
    return (
      <div className="panel__details">
        {fields.map(item => <EntityProperty key={item.name} {...item} placeholder=" " />)}
      </div>
    );
  };

  renderTriggersSection = () => <FunctionTriggers id={this.props.entity.id} details />;

  handleFilesEditorChange = () =>
    this.setState({changed: true}, () => this.props.parent.checkPristine());

  renderFunctionCodeSection = () => {
    const {files, serverless: {provider: {runtime}}} = this.props.entity.service;
    const {editorCodeLanguage} = runtimeMapping(runtime);
    return (
      <FilesEditor
        lang={editorCodeLanguage}
        files={files}
        onChange={this.handleFilesEditorChange}
        defaultSelect="handler.js"
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
