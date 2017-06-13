import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ModalContainer, ModalDialog} from 'react-modal-dialog';
import './Modal.scss';

export default (ComposedComponent) => {
  return class Modal extends Component {
    static propTypes = {
      onClose: PropTypes.func,
      onSave: PropTypes.func,
      onCancel: PropTypes.func,
      width: PropTypes.number
    };

    static defaultProps = {
      width: 450
    };

    render() {
      return (
        <ModalContainer zIndex={20} onClose={this.props.onClose} className="modal">
          <ModalDialog onClose={this.props.onClose} width={this.props.width} className="modal__dialog">
            <ComposedComponent {...this.props} {...this.state} modal={this}/>
          </ModalDialog>
        </ModalContainer>
      );
    }
  }
}
