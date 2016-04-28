import React, {Component, PropTypes} from 'react';
import TwoOptionModal from 'components/Generics/Modal/TwoOptionModal';

export default class SaveButton extends Component {
  static propTypes = {
    handleClick: PropTypes.func,
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
      }
    };

    this.handleClose = () => {
      this.setState({isShowingModal: false});
    };
  }

  render() {
    return (
      <a className="confirm-button__accept" onClick={this.handleClick.bind(this)}>
        <span className="confirm-button__button">Save</span>

        {
          this.state.isShowingModal &&
          <TwoOptionModal onClose={this.handleClose} onSave={this.props.onSave} onCancel={this.props.onCancel}>
            <span>You have unsaved changes, what You gonna do with that?</span>
          </TwoOptionModal>
        }
      </a>
    )
  }
}
