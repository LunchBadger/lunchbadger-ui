import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import {togglePanel} from '../../reduxActions';

class CloseButton extends Component {
  static propTypes = {
    showConfirmation: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    togglePanel: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false
    };
  }

  handleClick = () => {
    const {showConfirmation, togglePanel} = this.props;
    if (showConfirmation) {
      this.setState({isShowingModal: true});
    } else {
      togglePanel(null);
    }
  };

  handleClose = () => {
    this.setState({isShowingModal: false});
  };

  handleSave = () => {
    const {onSave, togglePanel} = this.props;
    onSave();
    togglePanel(null);
  }

  handleCancel = () => {
    const {onCancel, togglePanel} = this.props;
    onCancel();
    togglePanel(null);
  }

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

const mapDispatchToProps = dispatch => ({
  togglePanel: panel => dispatch(togglePanel(panel)),
});

export default connect(null, mapDispatchToProps)(CloseButton);
