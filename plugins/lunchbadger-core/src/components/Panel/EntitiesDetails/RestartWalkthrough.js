import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import userStorage from '../../../utils/userStorage';
import {clearServer} from '../../../reduxActions/project';
import TwoOptionModal from '../../Generics/Modal/TwoOptionModal';
import {EntityPropertyLabel, Button} from '../../../../../lunchbadger-ui/src';
import './RestartWalkthrough.scss';

export default class RestartWalkthrough extends PureComponent {
  static contextTypes = {
    store: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      showConfirmModal: false,
    }
  }

  handleRestart = () => {
    userStorage.remove('walkthroughShown');
    this.context.store.dispatch(clearServer());
  };

  render() {
    const {showConfirmModal} = this.state;
    return (
      <div className="RestartWalkthrough details-panel__element">
        <div className="details-panel__fieldset">
          <EntityPropertyLabel>
            Walkthrough
          </EntityPropertyLabel>
          <div>
            <p>
            You can restart the walkthrough process here.
            It will start, when all entities will be removed from the canvas.
            </p>
            <p>
            <strong>
              Warning! Restarting the walkthrough will clear your project and the canvas.
            </strong>
            </p>
            <Button name="submit" onClick={() => this.setState({showConfirmModal: true})}>
              Restart Walkthrough
            </Button>
          </div>
        </div>
        {showConfirmModal && (
          <TwoOptionModal
            onClose={() => this.setState({showConfirmModal: false})}
            onSave={this.handleRestart}
            onCancel={() => this.setState({showConfirmModal: false})}
            title="Restart walkthrough"
            confirmText="Confirm"
            discardText="Cancel"
          >
            You are going to clear the project
            <br />
            and restart the walkthrough process.
            <br />
            Are you sure?
          </TwoOptionModal>
        )}
      </div>
    );
  }
}
