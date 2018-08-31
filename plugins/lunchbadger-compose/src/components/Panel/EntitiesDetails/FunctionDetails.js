import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import FunctionLogs from './FunctionLogs';
import FunctionLogsRefresher from './FunctionLogsRefresher';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  FilesEditor,
  Input,
} from '../../../../../lunchbadger-ui/src';
import {runtimeMapping} from '../../../utils';
import FunctionTriggers from '../../CanvasElements/Subelements/FunctionTriggers';
import './FunctionDetails.scss';

const {
  components: {BaseDetails},
  utils: {userStorage},
} = LunchBadgerCore;
const autorefreshDefaultPeriod = 10;
const autorefreshPeriods = [
  autorefreshDefaultPeriod,
  15,
  20,
  30,
  60,
].map(v => ({label: `${v} sec`, value: v}));

class FunctionDetails extends PureComponent {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  static contextTypes = {
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      autorefreshLogs: userStorage.get('functionLogsAutorefresh') === 'on',
      autorefreshPeriod: +userStorage.get('functionLogsAutorefreshPeriod') || autorefreshDefaultPeriod,
    };
  }

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
    const {editorCodeLanguage, extension} = runtimeMapping(runtime);
    const defaultSelect = `handler.${extension}`;
    return (
      <FilesEditor
        lang={editorCodeLanguage}
        files={files}
        onChange={this.handleFilesEditorChange}
        defaultSelect={defaultSelect}
      />
    );
  };

  renderLogsSection = () => {
    const {autorefreshLogs, autorefreshPeriod} = this.state;
    return (
      <FunctionLogs
        ref={r => this.logsRef = r}
        name={this.props.entity.name}
        autorefresh={autorefreshLogs}
        period={autorefreshPeriod}
      />
    );
  };

  handleAutorefreshLogsToggle = ({target: {checked: autorefreshLogs}}) => {
    this.setState({autorefreshLogs});
    userStorage.set('functionLogsAutorefresh', autorefreshLogs ? 'on' : 'off');
  };

  handleReloadLogs = () => this.logsRef.reloadLogs();

  handleAutorefreshPeriodChange = autorefreshPeriod => {
    this.setState({autorefreshPeriod});
    userStorage.set('functionLogsAutorefreshPeriod', autorefreshPeriod);
  };

  renderLogsRefresherSection = () => {
    const {autorefreshLogs, autorefreshPeriod} = this.state;
    return (
      <FunctionLogsRefresher
        autorefresh={autorefreshLogs}
        period={autorefreshPeriod}
        periodOptions={autorefreshPeriods}
        onAutorefreshToggle={this.handleAutorefreshLogsToggle}
        onReloadLogs={this.handleReloadLogs}
        onPeriodChange={this.handleAutorefreshPeriodChange}
      />
    );
  };

  render() {
    const {name, service: {serverless: {provider: {runtime}}}} = this.props.entity;
    const sections = [
      {title: 'Details'},
      {title: 'Triggers'},
      {title: 'Function Code', render: 'FunctionCode'},
      {title: 'Logs', renderButton: 'LogsRefresher'},
    ];
    return (
      <div className="FunctionDetails">
        <Input
          type="hidden"
          name="name"
          value={name}
        />
        <Input
          type="hidden"
          name="runtime"
          value={runtime}
        />
        {sections.map(({title, render, renderButton}) => (
          <CollapsibleProperties
            key={title}
            bar={<EntityPropertyLabel>{title}</EntityPropertyLabel>}
            collapsible={this[`render${render || title}Section`]()}
            button={renderButton && this[`render${renderButton}Section`]()}
            barToggable
            defaultOpened
          />
        ))}
      </div>
    );
  }
}

export default BaseDetails(FunctionDetails);
