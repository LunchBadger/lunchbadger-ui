import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SystemDefcon1} from '../../../ui';

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

  handleConfirm = () => {
    const {onSave, onClose} = this.props;
    if (typeof onSave === 'function') {
      onSave();
    }
    onClose();
  }

  handleCancel = () => {
    const {onCancel, onClose} = this.props;
    if (typeof onCancel === 'function') {
      onCancel();
    }
    onClose();
  }

  handleDoubleClick = event => event.stopPropagation();

  handleClick = (event) => {
    this.props.onClose();
    event.stopPropagation();
  }

  render() {
    const {title, children, confirmText, discardText} = this.props;
    const buttons = [
      {label: confirmText, onClick: this.handleConfirm},
      {label: discardText, onClick: this.handleCancel},
    ];
    return (
      <div onClick={this.handleClick} onDoubleClick={this.handleDoubleClick}>
        <SystemDefcon1
          title={title}
          content={children}
          buttons={buttons}
        />
      </div>
    );
  }
}

export default TwoOptionModal;
