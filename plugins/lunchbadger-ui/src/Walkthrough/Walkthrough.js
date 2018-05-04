import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import './Walkthrough.scss';

class Walkthrough extends PureComponent {
  static propTypes = {
    steps: PropTypes.array,
  };

  constructor(prop) {
    super(prop);
    this.state = {
      run: true,
    };
  }

  handleCallback = ({type, step}) => {
    if (type === 'step:after' && step.onAfter) {
      this.setRun(false);
      setTimeout(() => step.onAfter(() => this.setRun(true)));
    }
  };

  setRun = (run) => this.setState({run});

  render() {
    const {steps} = this.props;
    const {run} = this.state;
    return (
      <Joyride
        ref={r => this.joyride = r}
        steps={steps}
        type="continuous"
        run={run}
        autoStart
        showSkipButton
        showStepsProgress
        disableOverlay
        showBackButton={false}
        callback={this.handleCallback}
      />
    );
  }
}

export default Walkthrough;
