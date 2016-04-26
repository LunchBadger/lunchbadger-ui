import React, {Component, PropTypes} from 'react';
import Modal from './Modal';

class TwoOptionModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    confirmText: PropTypes.string,
    discardText: PropTypes.string
  };

  static defaultProps = {
    title: 'Save changes?',
    confirmText: 'Confirm changes',
    discardText: 'Discard changes'
  };

  _handleConfirm() {
    if (typeof this.props.onSave === 'function') {
      this.props.onSave();
    }

    this.props.onClose();
  }

  _handleCancel() {
    if (typeof this.props.onCancel === 'function') {
      this.props.onCancel();
    }

    this.props.onClose();
  }

  render() {
    return (
      <div className="modal__body">
        <h1 className="modal__title">{this.props.title}</h1>
        <p className="modal__message">{this.props.children}</p>

        <div className="modal__actions">
          <button className="modal__actions__button modal__actions__button--confirm"
                  onClick={this._handleConfirm.bind(this)}>
            {this.props.confirmText}
          </button>

          <button className="modal__actions__button modal__actions__button--discard"
                  onClick={this._handleCancel.bind(this)}>
            {this.props.discardText}
          </button>
        </div>
      </div>
    );
  }
}

export default Modal(TwoOptionModal);
