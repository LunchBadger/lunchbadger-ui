import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {togglePanel} from '../../reduxActions';

class CloseButton extends Component {
  static propTypes = {
    showConfirmation: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
    };
  }

  handleClick = () => {
    if (this.props.showConfirmation) {
      this.setState({isShowingModal: true});
    } else {
      this.clearPanel();
    }
  };

  handleClose = () => {
    this.setState({isShowingModal: false});
  };

  handleSave = () => {
    this.props.onSave();
    this.clearPanel();
  }

  handleCancel = () => {
    this.props.onCancel();
    this.clearPanel();
  }

  clearPanel = () => this.context.store.dispatch(togglePanel(null));

  render() {
    return (
      <a className="confirm-button__cancel" onClick={this.handleClick}>
        <i className="fa fa-remove"/>
        {this.state.isShowingModal && (
          <TwoOptionModal
            onClose={this.handleClose}
            onSave={this.handleSave}
            onCancel={this.handleCancel}
          >
            <span>You have unsaved changes, what You gonna do with that?</span>
          </TwoOptionModal>
        )}
      </a>
    );
  }
}

export default CloseButton;
