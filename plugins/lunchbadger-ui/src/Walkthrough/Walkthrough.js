import React, {PureComponent} from 'react';
import userStorage from '../../../lunchbadger-core/src/utils/userStorage';
import WalkthroughInner from './WalkthroughInner';

export default class Walkthrough extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lastStep: userStorage.getNumber('walkthroughLastStep'),
    };
  }

  componentDidMount() {
    if (!this.silentUpdateInterval) {
      this.silentUpdateInterval = setInterval(this.handleSilentUpdate, 1000);
    }
  }

  componentWillUnmount() {
    this.silentUpdateInterval && clearInterval(this.silentUpdateInterval);
  }

  handleSilentUpdate = () => {
    const lastStep = userStorage.getNumber('walkthroughLastStep');
    if (this.state.lastStep !== lastStep) {
      this.setState({lastStep: null}, () => setTimeout(() =>
        this.setState({lastStep})
      ), 500);
    }
  };

  render() {
    const {lastStep} = this.state;
    if (lastStep !== userStorage.getNumber('walkthroughLastStep')) return null;
    return (
      <WalkthroughInner
        {...this.props}
        onStepChange={lastStep => this.setState({lastStep})}
      />
    );
  }
}
