import React, {PureComponent} from 'react';
import BadgerLogo from './badger-logo.svg';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import Config from '../../../../../src/config';
import './Header.scss';

const homepageUrl = Config.get('homepageUrl');

export default class Logo extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showConfirmModal: false,
    }
  }
  handleClick = (event) => {
    this.setState({showConfirmModal: true});
    event.preventDefault();
  };

  handleRedirect = () => document.location.href = homepageUrl;

  render() {
    const {showConfirmModal} = this.state;
    return (
      <span>
        <a href={homepageUrl} onClick={this.handleClick}>
          <img src={BadgerLogo} className="Logo" alt="LunchBadger logo - a smiling badger" />
          <p className="logotype" >LunchBadger</p>
        </a>
        {showConfirmModal && (
          <TwoOptionModal
            onClose={() => this.setState({showConfirmModal: false})}
            onSave={this.handleRedirect}
            onCancel={() => this.setState({showConfirmModal: false})}
            title="Exit LunchBadger Application"
            confirmText="Exit"
            discardText="Cancel"
          >
            You are going to exit LunchBadger application.
            <br />
            Are you sure?
          </TwoOptionModal>
        )}
      </span>
    );
  }
}
