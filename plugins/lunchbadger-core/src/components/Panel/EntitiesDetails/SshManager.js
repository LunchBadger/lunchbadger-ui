import React, {PureComponent} from 'react';
import {findDOMNode} from 'react-dom';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import SshManagerService from '../../../services/SshManagerService';
import TwoOptionModal from '../../Generics/Modal/TwoOptionModal';
import {addSystemDefcon1} from '../../../reduxActions/systemDefcon1';
import Config from '../../../../../../src/config';
import {
  Form,
  EntityActionButtons,
  EntityProperty,
  EntityPropertyLabel,
  CollapsibleProperties,
  Table,
  IconButton,
  CopyOnHover,
  DocsLink,
} from '../../../../../lunchbadger-ui/src';
import './SshManager.scss';

const {uploadPublicKeys} = Config.get('features');

class SshManager extends PureComponent {
  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      publicKeys: [],
      showRemovingModal: false,
      idToRemove: null,
      adding: false,
      invalid: '',
      uploadDisabled: false,
    };
    this.loaded = false;
  }

  componentWillUpdate(nextProps) {
    if (!this.loaded && nextProps.currentlyOpenedPanel === 'SETTINGS_PANEL') {
      this.loaded = true;
      this.loadPublicKeys();
    }
  }

  loadPublicKeys = async () => {
    if (!uploadPublicKeys) return;
    try {
      const {body: {publicKeys}} = await SshManagerService.load();
      this.setState({publicKeys});
    } catch (error) {
      this.context.store.dispatch(addSystemDefcon1({error}));
    }
  };

  handleUploadPublicKey = () => {
    this.setState({adding: true}, () => {
      if (!uploadPublicKeys) return;
      const input = findDOMNode(this.formRef).querySelector('input');
      input && input.focus();
    });
  };

  handleRemovePublicKey = idToRemove => this.setState({showRemovingModal: true, idToRemove});

  removePublicKey = async () => {
    this.setState({showRemovingModal: false});
    const {idToRemove} = this.state;
    try {
      await SshManagerService.remove(idToRemove);
    } catch (error) {
      this.context.store.dispatch(addSystemDefcon1({error}));
    }
    await this.loadPublicKeys();
  };

  handleUpload = async (model) => {
    if (model.publicKey === '') {
      this.setState({invalid: 'no key provided'});
      return;
    }
    this.setState({uploadDisabled: true});
    try {
      const {body: {result: {id}}} = await SshManagerService.create(model);
      if (id === 0) {
        this.setState({invalid: 'upload failure (invalid key or already provided)', uploadDisabled: false});
        return;
      }
      this.setState({adding: false, invalid: '', uploadDisabled: false});
      await this.loadPublicKeys();
    } catch (error) {
      if (error.statusCode === 404) {
        this.context.store.dispatch(addSystemDefcon1({error}));
      } else {
        this.setState({invalid: error.message, uploadDisabled: false});
      }
    }
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
    return ((x < y) ? 1 : ((x > y) ? -1 : 0));
  };

  renderPublicKeys = () => {
    const {
      publicKeys,
      adding,
      invalid,
      uploadDisabled,
    } = this.state;
    const columns = [
      'Created at',
      'Key Id',
      'Label',
      'Fingerprint',
      adding ? '' : <IconButton icon="iconPlus" onClick={this.handleUploadPublicKey} />,
    ];
    const data = publicKeys
      .sort(this.sortByKey('created_at'))
      .map(({
        id,
        created_at,
        title,
        fingerprint,
        key,
      }) => {
        const email = key.split(' ').pop();
        return [
          created_at.replace(/[TZ]/g, ' ').trim(),
          /@/.test(email) ? <CopyOnHover copy={email}>{email}</CopyOnHover> : '',
          <CopyOnHover copy={title}>{title}</CopyOnHover>,
          <CopyOnHover copy={fingerprint}>{fingerprint}</CopyOnHover>,
          <IconButton icon="iconDelete" onClick={() => this.handleRemovePublicKey(id)} />,
        ];
      });
    const widths = [
      140,
      290,
      270,
      undefined,
      50,
    ];
    const paddings = [
      true,
      true,
      true,
      true,
      false,
    ];
    return (
      <div>
        {adding && !uploadPublicKeys && (
          <div className="accessInfo">
            Public keys upload is not part of the trial - please contact LunchBadger support to learn more
          </div>
        )}
        {adding && uploadPublicKeys && (
          <Form
            ref={r => this.formRef = r}
            name="publicKey"
            onValidSubmit={this.handleUpload}
          >
            <EntityProperty
              name="title"
              value=""
              title="Label"
              placeholder="Enter label here..."
            />
            <EntityProperty
              name="publicKey"
              value=""
              title="Key"
              placeholder="Enter key here..."
              textarea
              invalid={invalid}
            />
            <EntityActionButtons
              onCancel={() => this.setState({adding: false, invalid: ''})}
              okLabel="Upload"
              okDisabled={uploadDisabled}
            />
          </Form>
        )}
        <Table
          columns={columns}
          data={data}
          widths={widths}
          paddings={paddings}
          tableLayout="fixed"
          verticalAlign="middle"
        />
      </div>
    );
  };

  render() {
    const {showRemovingModal} = this.state;
    const bar = (
      <EntityPropertyLabel>
        Public Keys
        <DocsLink item="SETTINGS_GIT_ACCESS" />
      </EntityPropertyLabel>
    );
    return (
      <div className="SshManager">
        <CollapsibleProperties
          bar={bar}
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

const selector = createSelector(
  state => state.states.currentlyOpenedPanel,
  currentlyOpenedPanel => ({currentlyOpenedPanel}),
);

export default connect(selector)(SshManager);
