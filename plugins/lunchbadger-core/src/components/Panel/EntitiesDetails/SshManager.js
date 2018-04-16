import React, {PureComponent} from 'react';
import SshManagerService from '../../../services/SshManagerService';
import TwoOptionModal from '../../Generics/Modal/TwoOptionModal';
import {
  EntityPropertyLabel,
  CollapsibleProperties,
  Table,
  IconButton,
  CopyOnHover,
} from '../../../../../lunchbadger-ui/src';
import './SshManager.scss';

class SshManager extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      publicKeys: [],
      showRemovingModal: false,
      idToRemove: null,
    };
  }

  componentWillMount() {
    this.loadPublicKeys();
  }

  loadPublicKeys = async () => {
    const {body: {publicKeys}} = await SshManagerService.load();
    this.setState({publicKeys});
  };

  handleRemovePublicKey = idToRemove => this.setState({showRemovingModal: true, idToRemove});

  removePublicKey = async () => {
    this.setState({showRemovingModal: false});
    const {idToRemove} = this.state;
    await SshManagerService.remove(idToRemove);
    await this.loadPublicKeys();
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

  renderPublicKeys = () => {
    const {publicKeys} = this.state;
    const columns = [
      'Created at',
      'Title',
      'Fingerprint',
      '',
    ];
    const data = publicKeys
      .sort(this.sortByKey('created_at'))
      .map(({
        id,
        created_at,
        title,
        fingerprint,
      }) => [
        created_at.replace(/[TZ]/g, ' ').trim(),
        <CopyOnHover copy={title}>{title}</CopyOnHover>,
        <CopyOnHover copy={fingerprint}>{fingerprint}</CopyOnHover>,
        <IconButton icon="iconDelete" onClick={() => this.handleRemovePublicKey(id)} />,
    ]);
    const widths = [
      160,
      400,
      undefined,
      50,
    ];
    const paddings = [
      true,
      true,
      true,
      false,
    ];
    return <Table
      columns={columns}
      data={data}
      widths={widths}
      paddings={paddings}
      tableLayout="fixed"
      verticalAlign="middle"
    />;
  };

  render() {
    const {showRemovingModal} = this.state;
    return (
      <div className="SshManager">
        <CollapsibleProperties
          bar={<EntityPropertyLabel>Public Keys</EntityPropertyLabel>}
          collapsible={this.renderPublicKeys()}
          barToggable
          defaultOpened
        />
        {showRemovingModal && (
          <TwoOptionModal
            onClose={() => this.setState({showRemovingModal: false})}
            onSave={this.removePublicKey}
            onCancel={() => this.setState({showRemovingModal: false})}
            title="Remove public key"
            confirmText="Remove"
            discardText="Cancel"
          >
            Do you really want to remove that public key?
          </TwoOptionModal>
        )}
      </div>
    )
  }
}

export default SshManager;
