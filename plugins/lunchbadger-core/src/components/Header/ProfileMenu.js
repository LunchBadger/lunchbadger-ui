import React, {PureComponent} from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import {IconButton as Icon, ContextualInformationMessage} from '../../ui';
import {getUser} from '../../utils/auth';
import {logout} from '../../reduxActions/project';
import TwoOptionModal from '../../components/Generics/Modal/TwoOptionModal';

const menuStyle = {
  fontWeight: 400,
  fontSize: '15px',
  lineHeight: '32px',
};

export default class ProfileMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmModal: false,
    };
  }

  renderLoggedIn = () => (
    <div>
      {'Signed in as'}
      {' '}
      <strong>{getUser().profile.preferred_username}</strong>
    </div>
  );

  render() {
    const {showConfirmModal} = this.state;
    return (
      <span>
        <ContextualInformationMessage
          tooltip="Profile"
          direction="bottom"
        >
          <IconMenu
            iconButtonElement={<IconButton><Icon icon="iconProfile" /></IconButton>}
            anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            targetOrigin={{horizontal: 'right', vertical: 'top'}}
            onChange={() => {}}
            touchTapCloseDelay={1}
            desktop
            listStyle={menuStyle}
          >
            <MenuItem
              primaryText={this.renderLoggedIn()}
              disabled
            />
            <Divider />
            <MenuItem primaryText="Logout" onClick={() => this.setState({showConfirmModal: true})} />
          </IconMenu>
        </ContextualInformationMessage>
        {showConfirmModal && (
          <TwoOptionModal
            onClose={() => this.setState({showConfirmModal: false})}
            onSave={logout()}
            onCancel={() => this.setState({showConfirmModal: false})}
            title="Logging out"
            confirmText="Log out"
            discardText="Cancel"
          >
            Are you sure, you want to log out from the workspace?
          </TwoOptionModal>
        )}
      </span>
    );
  }
}
