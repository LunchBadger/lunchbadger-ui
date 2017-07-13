import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import './CanvasOverlay.scss';

class CanvasOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowingModal: false,
    };
  }

  handleClose = () => {
    this.setState({isShowingModal: false});
  };

  handleClick = () => {
    this.setState({isShowingModal: true});
    this.props.handleClick();
  }

  render() {
    const {panelEditingStatus, handleSave, handleCancel} = this.props;
    if (!panelEditingStatus) return null;
    const {isShowingModal} = this.state;
    return (
      <div className="canvas-overlay" onClick={this.handleClick}>
        {isShowingModal && (
          <TwoOptionModal
            onClose={this.handleClose}
            onSave={handleSave}
            onCancel={handleCancel}
          >
            You have unsaved changes!
          </TwoOptionModal>
        )}
      </div>
    )
  }
}

CanvasOverlay.propTypes = {
  panelEditingStatus: PropTypes.bool.isRequired,
  handleClick: PropTypes.func,
  handleSave: PropTypes.func,
  handleCancel: PropTypes.func,
};

CanvasOverlay.defaultProps = {
  handleClick: () => {},
  handleSave: () => {},
  handleCancel: () => {},
};

const mapStateToProps = state => ({
  panelEditingStatus: state.core.appState.panelEditingStatus,
  handleSave: state.core.appState.panelEditingStatusSave,
  handleCancel: state.core.appState.panelEditingStatusDiscard,
});

export default connect(mapStateToProps)(CanvasOverlay);
