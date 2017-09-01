import React, {Component, PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import './CanvasOverlay.scss';

class CanvasOverlay extends PureComponent {
  static propTypes = {
    panelEditingStatus: PropTypes.bool,
  };

  static defaultProps = {
    panelEditingStatus: null,
  };

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
  }

  render() {
    const {panelEditingStatus, panelEditingStatusSave, panelEditingStatusDiscard} = this.props;
    if (!panelEditingStatus) return null;
    const {isShowingModal} = this.state;
    return (
      <div className="canvas-overlay" onClick={this.handleClick}>
        {isShowingModal && (
          <TwoOptionModal
            onClose={this.handleClose}
            onSave={panelEditingStatusSave}
            onCancel={panelEditingStatusDiscard}
          >
            You have unsaved changes!
          </TwoOptionModal>
        )}
      </div>
    )
  }
}

const selector = createSelector(
  state => state.states.panelEditingStatus,
  state => state.states.panelEditingStatusSave,
  state => state.states.panelEditingStatusDiscard,
  (panelEditingStatus, panelEditingStatusSave, panelEditingStatusDiscard) => ({
    panelEditingStatus, panelEditingStatusSave, panelEditingStatusDiscard
  }),
);

export default connect(selector)(CanvasOverlay);
