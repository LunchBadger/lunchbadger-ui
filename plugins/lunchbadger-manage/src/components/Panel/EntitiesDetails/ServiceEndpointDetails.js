import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {
  EntityPropertyLabel,
  CollapsibleProperties,
  Input,
  Table,
  IconButton,
} from '../../../../../lunchbadger-ui/src';

const BaseDetails = LunchBadgerCore.components.BaseDetails;

class ServiceEndpointDetails extends PureComponent {
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
    urls: props.entity.urls.slice(),
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

  handleUrlTab = idx => (event) => {
    if (!((event.which === 9 || event.keyCode === 9) && !event.shiftKey)) return;
    const size = this.state.urls.length;
    if (size - 1 === idx) {
      this.addUrl();
    }
  };

  addUrl = () => {
    const urls = this.state.urls.slice();
    urls.push('');
    this.changeState({urls});
    setTimeout(() => {
      const idx = urls.length - 1;
      const input = document.getElementById(`urls[${idx}]`);
      input && input.focus();
    });
  }

  removeUrl = idx => () => {
    if (this.state.urls.length === 1) return;
    const urls = this.state.urls.slice();
    urls.splice(idx, 1);
    this.changeState({urls});
  }

  renderUrlsSection = () => {
    const {urls} = this.state;
    const columns = [
      'Url',
      <IconButton icon="iconPlus" onClick={this.addUrl} />,
    ];
    const widths = [undefined, 70];
    const paddings = [true, false];
    const data = urls.map((url, idx) => [
      <Input
        name={`urls[${idx}]`}
        value={url}
        underlineStyle={{bottom: 0}}
        fullWidth
        hideUnderline
        handleKeyDown={this.handleUrlTab(idx)}
      />,
      idx === 0 ? null : <IconButton icon="iconDelete" onClick={this.removeUrl(idx)} />,
    ]);
    const collapsible = <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
    />;
    const title = `URL${urls.length === 1 ? '' : 'S'}`;
    return (
      <CollapsibleProperties
        key="urls"
        bar={<EntityPropertyLabel>{title}</EntityPropertyLabel>}
        collapsible={collapsible}
        barToggable
        defaultOpened
      />
    );
  }

  render() {
    const sections = [
      {title: 'Urls'},
    ];
    return (
      <div className="panel__details">
        {sections.map(({title, render}) => this[`render${render || title}Section`]())}
      </div>
    );
  }

}

export default BaseDetails(ServiceEndpointDetails);
