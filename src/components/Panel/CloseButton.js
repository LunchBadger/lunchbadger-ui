import React, {Component, PropTypes} from 'react';
import TwoOptionModal from 'components/Generics/Modal/TwoOptionModal';
import togglePanel from 'actions/togglePanel';

export default class CloseButton extends Component {
  static propTypes = {
    showConfirmation: PropTypes.bool,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      isShowingModal: false
    };

    this.handleClick = () => {
      if (this.props.showConfirmation) {
        this.setState({isShowingModal: true});
      } else {
        this.props.onSave();
        togglePanel(null);
      }
    };

    this.handleClose = () => {
      this.setState({isShowingModal: false});
    };
  }

  _handleSave() {
    this.props.onSave();
    togglePanel(null);
  }

  _handleCancel() {
    this.props.onCancel();
    togglePanel(null);
  }

  render() {
    return (
      <a className="confirm-button__cancel" onClick={this.handleClick.bind(this)}>
        <i className="fa fa-remove"/>

        {
          this.state.isShowingModal &&
          <TwoOptionModal onClose={this.handleClose}
                          onSave={this._handleSave.bind(this)}
                          onCancel={this._handleCancel.bind(this)}>
            <span>You have unsaved changes, what You gonna do with that?</span>
          </TwoOptionModal>
        }
      </a>
    )
  }
}
