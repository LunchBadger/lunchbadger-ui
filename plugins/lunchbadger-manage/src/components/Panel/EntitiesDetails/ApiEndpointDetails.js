import React, {Component} from 'react';
import PropTypes from 'prop-types';
import cs from 'classnames';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';
import './ApiEndpointDetails.scss';

const BaseDetails = LunchBadgerCore.components.BaseDetails;
const {requestMethods} = LunchBadgerCore.utils;
const methodsOptions = requestMethods.map(label => ({label, value: label}));

class ApiEndpointDetails extends Component {
  static propTypes = {
    entity: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {...this.stateFromStores(props)};
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.entity !== nextProps.entity) {
      this.onPropsUpdate(nextProps);
    }
  }

  stateFromStores = props => ({
    changed: false,
    paths: props.entity.paths.slice(),
    methods: props.entity.methods.slice(),
  });

  onPropsUpdate = (props = this.props, callback) => this.setState({...this.stateFromStores(props)}, callback);

  discardChanges = callback => this.onPropsUpdate(this.props, callback);

  processModel = model => {
    const {entity} = this.props;
    return entity.processModel(model);
  };

  changeState = (obj, cb) => this.setState({...obj, changed: true}, () => {
    this.props.parent.checkPristine();
    cb && cb();
  });

  handlePathTab = idx => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const size = this.state.paths.length;
    if (size - 1 === idx) {
      this.addPath();
    }
  };

  addPath = () => {
    const paths = this.state.paths.slice();
    paths.push('');
    const {length} = paths;
    this.changeState({paths});
    setTimeout(() => {
      const idx = length - 1;
      const input = document.getElementById(`paths[${idx}]`);
      input && input.focus();
    });
  };

  removePath = idx => () => {
    const paths = this.state.paths.slice();
    paths.splice(idx, 1);
    this.changeState({paths});
  };

  handleMethodsChange = methods => this.changeState({methods});

  renderHostSection = () => {
    const {host} = this.props.entity;
    return (
      <EntityProperty
        key="host"
        title="Host"
        placeholder=" "
        name="host"
        value={host}
        width="100%"
      />
    );
  }

  renderPathsSection = () => {
    const {paths} = this.state;
    const columns = [
      'Path',
      <IconButton icon="iconPlus" onClick={this.addPath} />,
    ];
    const widths = [undefined, 70];
    const paddings = [true, false];
    const data = paths.map((path, idx) => [
      <Input
        name={`paths[${idx}]`}
        value={path}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleKeyDown={this.handlePathTab(idx)}
      />,
      <IconButton icon="iconDelete" onClick={this.removePath(idx)} />,
    ]);
    const table = <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
    />;
    return (
      <CollapsibleProperties
        key="paths"
        bar={<EntityPropertyLabel>Paths</EntityPropertyLabel>}
        collapsible={table}
        defaultOpened
      />
    );
  }

  renderMethodsSection = () => {
    const {methods} = this.state;
    return (
      <EntityProperty
        key="methods"
        title="Methods"
        name="methods"
        value={methods}
        placeholder=" "
        type="array"
        width="100%"
        options={methodsOptions}
        chips
        autocomplete
        onChange={this.handleMethodsChange}
      />
    );
  }

  render() {
    const sections = [
      {title: 'Host'},
      {title: 'Methods'},
      {title: 'Paths'},
    ];
    return (
      <div className={cs('ApiEndpointDetails', 'panel__details')}>
        {sections.map(({title, render}) => this[`render${render || title}Section`]())}
      </div>
    );
  }
}

export default BaseDetails(ApiEndpointDetails);
