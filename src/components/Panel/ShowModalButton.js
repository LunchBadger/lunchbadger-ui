import React, {Component} from 'react';
import TwoOptionModal from 'components/Generics/Modal/TwoOptionModal';
import './ShowModalButton.scss';

export default class ShowModalButton extends Component {
  state = {
    isShowingModal: false
  };

  handleClick = () => this.setState({isShowingModal: true});
  handleClose = () => this.setState({isShowingModal: false});

  render() {
    return (
      <a className={this.props.className} onClick={this.handleClick}>
        <span className="confirm-button__button">Save</span>
        <i className="fa fa-remove"/>

        {
          this.state.isShowingModal &&
          <TwoOptionModal onClose={this.handleClose} onSave={this.props.onSave} onCancel={this.props.onCancel}>
            <span>You have unsaved changes, what You gonna do with that?</span>
          </TwoOptionModal>
        }
      </a>
    );
  }
}
