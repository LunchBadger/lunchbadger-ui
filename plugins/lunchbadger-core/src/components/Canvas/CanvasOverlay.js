import React, {Component, PropTypes} from 'react';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import './CanvasOverlay.scss';

export default class CanvasOverlay extends Component {
  static propTypes = {
    handleClick: PropTypes.func,
    appState: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false
    };

    this.handleClose = () => {
      this.setState({isShowingModal: false});
    };
  }

  _handleClick() {
    this.setState({isShowingModal: true});

    if (typeof this.props.handleClick === 'function') {
      this.props.handleClick();
    }
  }

  _handleSave() {
    const saveFunction = this.props.appState.getStateKey('panelEditingStatusSave');

    if (typeof saveFunction === 'function') {
      saveFunction();
    }
  }

  _handleCancel() {
    const cancelFunction = this.props.appState.getStateKey('panelEditingStatusDiscard');

    if (typeof cancelFunction === 'function') {
      cancelFunction();
    }
  }

  render() {
    return (
      <div className="canvas-overlay" onClick={this._handleClick.bind(this)}>
        {
          this.state.isShowingModal &&
          <TwoOptionModal onClose={this.handleClose}
                          onSave={this._handleSave.bind(this)}
                          onCancel={this._handleCancel.bind(this)}>
            <span>You have unsaved changes!</span>
          </TwoOptionModal>
        }
      </div>
    )
  }
}
