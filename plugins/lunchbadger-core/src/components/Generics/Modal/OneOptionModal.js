import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Modal from './Modal';

class OneOptionModal extends Component {
  static propTypes = {
    title: PropTypes.string,
    confirmText: PropTypes.string,
    onClose: PropTypes.func
  };

  static defaultProps = {
    title: 'Notification',
    confirmText: 'Ok'
  };

  _handleConfirm = () => {
    this.props.onClose();
  }

  render() {
    return (
      <div className="modal__body">
        <h1 className="modal__title">{this.props.title}</h1>
        <p className="modal__message">{this.props.children}</p>

        <div className="modal__actions">
          <button className="modal__actions__button modal__actions__button--confirm"
                  onClick={this._handleConfirm}>
            {this.props.confirmText}
          </button>
        </div>
      </div>
    );
  }
}

export default Modal(OneOptionModal);
