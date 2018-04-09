import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import _ from 'lodash';
import GatewayPolicyAction from './GatewayPolicyAction';
import {
  Table,
  IconButton,
  Button,
  Checkbox,
  CollapsibleProperties,
  EntityProperty,
  EntityPropertyLabel,
  IconSVG,
  Select,
} from '../../../../../../lunchbadger-ui/src';
import {iconCheck} from '../../../../../../../src/icons';
const {TwoOptionModal} = LunchBadgerCore.components;
import './CustomerManagement.scss';

const tabs = [
  'Users',
  'Apps',
  'Scopes',
];

const credentialsTypes = [
  'basic-auth',
  'key-auth',
  'oauth2',
];

const check = <IconSVG svg={iconCheck} className="CustomerManagement__check"/>;

class CustomerManagement extends PureComponent {
  static contextTypes = {
    store: PropTypes.object,
    paper: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      activeTab: tabs[0],
      entry: null,
      users: [],
      apps: [],
      credentials: [],
      showRemovingModal: false,
      entryToRemove: null,
      entryToRemoveType: null,
      loadingUsers: true,
      loadingApps: true,
      credentials: {},
      scopes: [],
      filterUsers: '',
      filterApps: '',
    };
  }

  componentWillMount() {
    const {model} = this.context.store.getState().entities.gatewaySchemas;
    this.modelSchemas = model;
  }

  componentDidMount() {
    this.loadUsers();
    this.loadApps();
    this.loadScopes();
  }

  loadUsers = async (start = 0) => {
    const {api} = this.props;
    const {body: {users, nextKey}} = await api.getUsers(start);
    const state = {
      users: (start === 0 ? [] : this.state.users).concat(users),
    };
    if (nextKey === '0') {
      state.loadingUsers = false;
    } else {
      this.loadUsers(nextKey);
    }
    this.setState(state);
  };

  loadApps = async (start = 0) => {
    const {api} = this.props;
    const {body: {apps, nextKey}} = await api.getApps(start);
    const state = {
      apps: (start === 0 ? [] : this.state.apps).concat(apps),
    };
    if (nextKey === '0') {
      state.loadingApps = false;
    } else {
      this.loadApps(nextKey);
    }
    this.setState(state);
  };

  loadCredentials = async (consumerId) => {
    if (!consumerId) return;
    const {api} = this.props;
    const {body} = await api.getCredentials(consumerId);
    const credentials = _.cloneDeep(this.state.credentials);
    credentials[consumerId] = body.credentials;
    this.setState({credentials});
  };

  loadScopes = async () => {
    const {api} = this.props;
    const {body: {scopes}} = await api.getScopes();
    this.setState({scopes});
  };

  handleTabClick = activeTab => () => this.setState({activeTab});

  handleEntry = (entry, activeTab = this.state.activeTab) => () => {
    if (['Users', 'Apps'].includes(activeTab)) {
      this.loadCredentials(entry);
    }
    this.setState({entry, activeTab});
  };

  handleToRemove = (entryToRemove, entryToRemoveType) => () => this.setState({
    showRemovingModal: true,
    entryToRemove,
    entryToRemoveType,
  });

  handleRemove = async () => {
    const {api} = this.props;
    const {entryToRemove, entryToRemoveType} = this.state;
    this.setState({
      showRemovingModal: false,
      entryToRemove: null,
      entryToRemoveType: null,
      [`loading${entryToRemoveType}`]: true,
    });
    if (entryToRemoveType === 'Users') {
      await api.removeUser(entryToRemove);
      await this.loadUsers();
      await this.loadApps();
    } else if (entryToRemoveType === 'Apps') {
      await api.removeApp(entryToRemove);
      await this.loadApps();
    }
  };

  handleOK = (event) => {
    event.preventDefault();
    event.stopPropagation();
    window.dispatchEvent(new CustomEvent('formSubmited', {detail: this.processModel}));
  };

  processModel = async ({consumerManagement}) => {
    const {users, apps} = consumerManagement;
    const {api} = this.props;
    const {entry} = this.state;
    const loading = `loading${users ? 'Users' : 'Apps'}`;
    this.setState({entry: null, [loading]: true});
    try {
      if (users) {
        if (entry === 0) {
          await api.createUser(users);
        } else {
          await api.updateUser(entry, users);
        }
        await this.loadUsers();
      }
      if (apps) {
        if (entry === 0) {
          await api.createApp(apps);
        } else {
          await api.updateApp(entry, apps);
        }
        await this.loadApps();
      }
    } catch (e) {
      // console.log(e); // FIXME
    }
  };

  handleCreateCredentials = (consumerId, type) => async () => {
    const {api} = this.props;
    const body = {
      consumerId,
      type,
    };
    await api.createCredentials(body);
    await this.loadCredentials(consumerId)
  };

  handleStatusChange = async ({currentTarget: {checked: status}}) => {
    const {entry, activeTab} = this.state;
    const {api} = this.props;
    if (activeTab === 'Users') {
      await api.setUserStatus(entry, status);
      await this.loadUsers();
    } else if (activeTab === 'Apps') {
      await api.setAppStatus(entry, status);
      await this.loadApps();
    }
  };

  handleCredentialsStatusChange = (type, consumerId, id) => async ({currentTarget: {checked: status}}) => {
    const {api} = this.props;
    await api.setCredentialsStatus(type, id, status);
    await this.loadCredentials(consumerId);
  };

  handleCredentialsScopesChange = (type, consumerId, id) => async (scopes) => {
    const {api} = this.props;
    await api.setCredentialsScopes(type, id, scopes);
    await this.loadCredentials(consumerId);
  };

  handleScopesChange = async (scopes) => {
    const {api} = this.props;
    const newScopes = _.difference(scopes, this.state.scopes);
    const removedScopes = _.difference(this.state.scopes, scopes);
    if (newScopes.length > 0) {
      await api.createScopes(newScopes);
    }
    for (let scope of removedScopes) {
      await api.removeScope(scope);
    }
    await this.loadScopes();
  };

  preventSubmit = event => {
    if (event.keyCode === 13 || event.which === 13) {
      event.preventDefault();
    }
  };

  handleFilterChange = ({target: {value}}) => {
    const {activeTab} = this.state;
    this.setState({[`filter${activeTab}`]: value});
  };

  filterUsers = item => {
    const check = new RegExp(this.state.filterUsers, 'i');
    return check.test(item.username) || check.test(item.firstname) || check.test(item.lastname);
  };

  filterApps = item => {
    const check = new RegExp(this.state.filterApps, 'i');
    return check.test(item.name);
  };

  sortByKey = key => (a, b) => {
    let x = a[key];
    let y = b[key];
    if (typeof x == 'string') {
      x = (''+x).toLowerCase();
    }
    if (typeof y == 'string') {
      y = (''+y).toLowerCase();
    }
    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  };

  renderFinder = () => {
    const {activeTab} = this.state;
    const filter = this.state[`filter${activeTab}`];
    return (
      <div className="CustomerManagement__finder">
        <EntityProperty
          name="tmp[finder]"
          value={filter}
          placeholder=" "
          onChange={this.handleFilterChange}
          onDelete={filter ? () => this.handleFilterChange({target: {value: ''}}) : undefined}
          onKeyDown={this.preventSubmit}
          icon="iconMagnifier"
        />
      </div>
    );
  };

  renderUsersList = () => {
    const {users, loadingUsers} = this.state;
    const columns = [
      'Username',
      'First Name',
      'Last Name',
      'Redirect URI',
      'Active',
      '',
      <IconButton icon="iconPlus" onClick={this.handleEntry(0, 'Users')} />,
    ];
    const widths = [200, 200, 200, undefined, 60, 30, 30];
    const paddings = [true, true, true, true, false, false, false];
    const centers = [false, false, false, false, true, false, false];
    const data = users
      .filter(this.filterUsers)
      .sort(this.sortByKey('username'))
      .map(({id, username, firstname, lastname, redirectUri, isActive}) => [
        username,
        firstname,
        lastname,
        redirectUri,
        isActive ? check : '',
        <IconButton icon="iconArrowRight" onClick={this.handleEntry(id, 'Users')} />,
        <IconButton icon="iconDelete" onClick={this.handleToRemove(id, 'Users')} />,
      ]);
    return (
      <div>
        {this.renderFinder()}
        <div className={cs('CustomerManagement__table', {loading: loadingUsers})}>
          <Table
            columns={columns}
            widths={widths}
            paddings={paddings}
            data={data}
            centers={centers}
          />
        </div>
      </div>
    );
  };

  renderUsersEntry = () => {
    const {entry, users, activeTab} = this.state;
    const user = {};
    if (entry) {
      Object.assign(user, users.find(({id}) => id === entry));
    }
    const schemas = _.cloneDeep(this.modelSchemas.users);
    if (entry !== 0) {
      schemas.properties.username.type = 'fake';
      delete user.isActive;
    }
    return (
      <div className="CustomerManagement__entry">
        <div className="CustomerManagement__details">
          <GatewayPolicyAction
            action={user}
            schemas={schemas}
            prefix="consumerManagement[users]"
            collapsibleTitle="Details"
            entry={entry}
          />
        </div>
        {(activeTab === 'Users' && entry !== 0) && (
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Apps</EntityPropertyLabel>}
            collapsible={this.renderAppsList(user.id)}
            barToggable
            defaultOpened
          />
        )}
        {entry !== 0 && (
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Credentials</EntityPropertyLabel>}
            collapsible={this.renderCredentialsList(entry)}
            barToggable
            defaultOpened
          />
        )}
        <Button
          onClick={this.handleOK}
          className="submit"
          name="submit"
        >
          OK
        </Button>
      </div>
    );
  };

  renderAppsList = (userId = null) => {
    const {users, apps, loadingApps} = this.state;
    const columns = [
      'Name',
      'Username',
      'Redirect URI',
      'Active',
      '',
      users.length ? <IconButton icon="iconPlus" onClick={this.handleEntry(0, 'Apps')} /> : '',
    ];
    let filteredApps = apps;
    if (userId !== null) {
      filteredApps = apps.filter(item => item.userId === userId);
    }
    const widths = [200, 200, undefined, 60, 30, 30];
    const paddings = [true, true, true, false, false, false];
    const centers = [false, false, false, true, false, false];
    const data = filteredApps
      .filter(userId !== null ? () => true : this.filterApps)
      .sort(this.sortByKey('name'))
      .map(({id, userId, name, redirectUri, isActive}) => [
      name,
      (users.find(({id}) => id === userId) || {username: 'User removed'}).username,
      redirectUri,
      isActive ? check : '',
      <IconButton icon="iconArrowRight" onClick={this.handleEntry(id, 'Apps')} />,
      <IconButton icon="iconDelete" onClick={this.handleToRemove(id, 'Apps')} />,
    ]);
    if (userId !== null) {
      columns.shift();
      widths.shift();
      paddings.shift();
      data.map(row => row.shift());
    }
    return (
      <div>
        {this.renderFinder()}
        <div className={cs('CustomerManagement__table', {loading: loadingApps})}>
          <Table
            columns={columns}
            widths={widths}
            paddings={paddings}
            data={data}
            centers={centers}
          />
        </div>
      </div>
    );
  };

  renderAppsEntry = () => {
    const {entry, users, apps} = this.state;
    const app = {};
    if (entry) {
      Object.assign(app, apps.find(({id}) => id === entry));
    }
    const schemas = _.cloneDeep(this.modelSchemas.applications);
    if (entry !== 0) {
      delete app.isActive;
      delete app.id;
      delete app.userId;
    } else {
      schemas.properties.userId = {
        type: 'string',
        enum: users.map(({username}) => username),
      };
      schemas.required.push('userId');
    }
    return (
      <div className="CustomerManagement__entry">
        <div className="CustomerManagement__details">
          <GatewayPolicyAction
            action={app}
            schemas={schemas}
            prefix="consumerManagement[apps]"
            collapsibleTitle="Details"
            entry={entry}
          />
        </div>
        {entry !== 0 && (
          <CollapsibleProperties
            bar={<EntityPropertyLabel>Credentials</EntityPropertyLabel>}
            collapsible={this.renderCredentialsList(entry)}
            barToggable
            defaultOpened
          />
        )}
        <Button
          onClick={this.handleOK}
          className="submit"
          name="submit"
        >
          OK
        </Button>
      </div>
    );
  };

  renderScopesList = () => {
    const {scopes} = this.state;
    return (
      <div className="CustomerManagement__scopes">
        <Select
          name="consumerManagement[scopes]"
          value={scopes || []}
          placeholder="null"
          options={[]}
          autocomplete
          multiple
          handleChange={this.handleScopesChange}
        />
      </div>
    );
  };

  renderCredentialsList = (consumerId) => {
    credentialsTypes
    return (
      <div>
        {credentialsTypes.map(type => (
          <CollapsibleProperties
            key={type}
            bar={<EntityPropertyLabel>{type}</EntityPropertyLabel>}
            collapsible={this.renderCredentialsListByType(consumerId, type)}
            barToggable
            defaultOpened
          />
        ))}
      </div>
    );
  };

  renderCredentialsListByType = (consumerId, type) => {
    const {loadingUsers, loadingApps} = this.state;
    const loading = loadingUsers || loadingApps;
    const credentials = this.state.credentials[consumerId] || [];
    const columns = [];
    const widths = [
      type === 'key-auth' ? 200 : 100,
      undefined,
      type === 'key-auth' ? 360 : 140,
      60,
      30,
    ];
    const paddings = [true, true, false, false, false];
    const centers = [false, false, type !== 'key-auth', true, false];
    const data = [];
    if (type === 'basic-auth') {
      columns.push('PasswordKey');
      columns.push('Password');
      credentials
        .filter(item => item.type === type)
        .forEach(({password, passwordKey, isActive, autoGeneratePassword}) => data.push([
          passwordKey,
          password,
          '', // autoGeneratePassword ? check : '',
          <Checkbox
            name="consumerManagement[credentials-basic-auth-status]"
            value={isActive}
            handleChange={this.handleCredentialsStatusChange('basic-auth', consumerId, consumerId)}
          />,
          '',
        ]));
    }
    if (type === 'key-auth') {
      columns.push('KeyId');
      columns.push('KeySecret');
      const scopesOptions = (this.state.scopes || []).map(label => ({label, value: label}));
      credentials
        .filter(item => item.type === type)
        .forEach(({keyId, keySecret, isActive, scopes}) => data.push([
          keyId,
          keySecret,
          <Select
            name="consumerManagement[credentials-key-auth-scopes]"
            placeholder="null"
            value={eval(scopes) || []}
            multiple
            autocomplete
            options={scopesOptions}
            handleChange={this.handleCredentialsScopesChange('key-auth', consumerId, keyId)}
          />,
          <Checkbox
            name="consumerManagement[credentials-key-auth-status]"
            value={isActive}
            handleChange={this.handleCredentialsStatusChange('key-auth', consumerId, keyId)}
          />,
          '',
        ]));
    }
    if (type === 'oauth2') {
      columns.push('PasswordKey');
      columns.push('Secret');
      credentials
        .filter(item => item.type === type)
        .forEach(({secret, passwordKey, isActive, autoGeneratePassword}) => data.push([
          passwordKey,
          secret,
          '', // autoGeneratePassword ? check : '',
          <Checkbox
            name="consumerManagement[credentials-oauth2-status]"
            value={isActive}
            handleChange={this.handleCredentialsStatusChange('oauth2', consumerId, consumerId)}
          />,
          '',
        ]));
    }
    columns.push(type === 'key-auth' ? 'Scopes' : ''); //'AutoGeneratePassword');
    columns.push('Active');
    let isAddButton = true;
    if (type !== 'key-auth') {
      isAddButton = !credentials.find(item => item.type === type);
    }
    columns.push(isAddButton ? <IconButton icon="iconPlus" onClick={this.handleCreateCredentials(consumerId, type)} /> : '');
    return (
      <div className={cs('CustomerManagement__table', {loading})}>
        <Table
          columns={columns}
          widths={widths}
          paddings={paddings}
          data={data}
          centers={centers}
        />
      </div>
    );
  };

  getActiveTabName = () => {
    return {
      Users: 'user',
      Apps: 'app',
      Credentials: 'credentials',
    }[this.state.activeTab];
  };

  getEntryStatus = () => {
    const {entry, activeTab} = this.state;
    return this.state[activeTab.toLowerCase()]
      .find(({id}) => id === entry)
      .isActive;
  };

  renderHeaderTitle = () => {
    const {entry} = this.state;
    if (entry !== 0) return entry;
    return `New ${this.getActiveTabName()}`;
  };

  render() {
    const {
      activeTab,
      entry,
      showRemovingModal,
    } = this.state;
    const activeTabName = this.getActiveTabName();
    return (
      <div className="CustomerManagement">
        {entry === null && (
          <div className="CustomerManagement__list">
            {this[`render${activeTab}List`]()}
            <div className="tabs">
              {tabs.map(tab => (
                <div
                  key={tab}
                  className={cs('tab', {active: tab === activeTab})}
                  onClick={this.handleTabClick(tab)}
                >
                  {tab}
                </div>
              ))}
            </div>
          </div>
        )}
        {entry !== null && (
          <div>
            <div className="CustomerManagement__header">
              <div className="back">
                <IconButton icon="iconArrowBack" onClick={this.handleEntry(null)} />
              </div>
              <div className="username">
                {this.renderHeaderTitle()}
              </div>
              {entry !== 0 && (
                <div className="status">
                  <Checkbox
                    name="consumerManagement[active]"
                    value={this.getEntryStatus()}
                    label="Active"
                    handleChange={this.handleStatusChange}
                  />
                </div>
              )}
            </div>
            {this[`render${activeTab}Entry`]()}
          </div>
        )}
        {showRemovingModal && (
          <TwoOptionModal
            onClose={() => this.setState({showRemovingModal: false})}
            onSave={this.handleRemove}
            onCancel={() => this.setState({showRemovingModal: false})}
            title={`Remove ${activeTabName}`}
            confirmText="Remove"
            discardText="Cancel"
          >
            Do you really want to remove this {activeTabName}?
          </TwoOptionModal>
        )}
      </div>
    );
  }
}

export default CustomerManagement;
