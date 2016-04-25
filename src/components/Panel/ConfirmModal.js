import React, {PropTypes} from 'react';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';

export default class CancelConfirm extends React.Component {
  static propTypes = {
    onClose: PropTypes.func
  };

  render() {
    return (
      <ModalContainer onClose={this.props.onClose}>
        <ModalDialog onClose={this.props.onClose} width={350} className="example-dialog">
          <h1>Save changes?</h1>
          <p>You have unsaved change, what You gonna do with that?</p>
          <button className="modal-container__accept" onClick={() => {this.props.onSave(); this.props.onClose();}}>Confirm changes</button>
          <button className="modal-container__cancel" onClick={() => {this.props.onCancel(); this.props.onClose();}}>Disacrd Changes</button>
        </ModalDialog>
      </ModalContainer>
    );
  }
}
