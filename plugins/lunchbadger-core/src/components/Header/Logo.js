import React, {PureComponent} from 'react';
import AppLogo from './app-logo.svg';
import TwoOptionModal from '../Generics/Modal/TwoOptionModal';
import Config from '../../../../../src/config';
import {GAEvent} from '../../ui';
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

  handleRedirect = () => {
    GAEvent('Header Menu', 'Exited App');
    document.location.href = homepageUrl;
  };

  render() {
    const {showConfirmModal} = this.state;
    return (
      <span>
        <a href={homepageUrl} onClick={this.handleClick}>
          <img src={AppLogo} className="Logo" alt="Express Serverless Platform" />
        </a>
        {showConfirmModal && (
          <TwoOptionModal
            onClose={() => this.setState({showConfirmModal: false})}
            onSave={this.handleRedirect}
            onCancel={() => this.setState({showConfirmModal: false})}
            title="Exit Express Serverless Platform Application"
            confirmText="Exit"
            discardText="Cancel"
          >
            You are going to exit Express Serverless Platform application.
            <br />
            Are you sure?
          </TwoOptionModal>
        )}
      </span>
    );
  }
}
