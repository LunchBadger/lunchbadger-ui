import React, {Component} from 'react';
import ConfirmModal from './ConfirmModal';
import './ShowModalButton.scss';

export default class ShowModalButton extends React.Component {
  state = {
    isShowingModal: false
  }
  handleClick = () => this.setState({isShowingModal: true})
  handleClose = () => this.setState({isShowingModal: false})

  render() {
    return (
      <a className={this.props.className} onClick={this.handleClick}>
        <span className="confirm-button__button">Save</span>
        <i className="fa fa-remove"></i>
        {
          this.state.isShowingModal &&
          <ConfirmModal onClose={this.handleClose} onSave={this.props.onSave}  onCancel={this.props.onCancel}/>
        }
      </a>
    );
  }
}
