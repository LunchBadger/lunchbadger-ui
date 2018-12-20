import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {SystemDefcon1} from '../../../ui';

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

  render() {
    const {title, children, confirmText: label, onClose: onClick} = this.props;
    const buttons = [];
    if (onClick) {
      buttons.push({label, onClick});
    }
    return (
      <SystemDefcon1
        title={title}
        content={children}
        buttons={buttons}
      />
    );
  }
}

export default OneOptionModal;
