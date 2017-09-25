import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

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
      this.onStoreUpdate(nextProps);
    }
  }

  stateFromStores = props => ({
    changed: false,
    paths: props.entity.paths.slice(),
  });

  onStoreUpdate = (props = this.props, callback) => this.setState({...this.stateFromStores(props)}, callback);

  discardChanges = callback => this.onStoreUpdate(this.props, callback);

  processModel = model => {
    const {entity} = this.props;
    return entity.processModel(model);
  };

  changeState = obj => this.setState({...obj, changed: true}, () => {
    this.props.parent.checkPristine();
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
    this.changeState({paths});
    setTimeout(() => {
      const idx = paths.length - 1;
      const input = document.getElementById(`paths[${idx}]`);
      input && input.focus();
    });
  }

  removePath = idx => () => {
    const paths = this.state.paths.slice();
    paths.splice(idx, 1);
    this.changeState({paths});
  }

  renderPropertiesSection = () => {
    const {paths} = this.state;
    const {host} = this.props.entity;
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
    const collapsible = (
      <div>
        <EntityProperty
          title="Host"
          placeholder=" "
          name="host"
          value={host}
        />
        <CollapsibleProperties
          bar={<EntityPropertyLabel>Paths</EntityPropertyLabel>}
          collapsible={table}
          defaultOpened
          untoggable
          space="15px 0 5px"
        />
      </div>
    )
    return (
      <CollapsibleProperties
        key="paths"
        bar={<EntityPropertyLabel>Properties</EntityPropertyLabel>}
        collapsible={collapsible}
        barToggable
        defaultOpened
      />
    );
  }

  render() {
    const sections = [
      {title: 'Properties'},
    ];
    return (
      <div className="panel__details">
        {sections.map(({title, render}) => this[`render${render || title}Section`]())}
      </div>
    );
  }
}

export default BaseDetails(ApiEndpointDetails);
