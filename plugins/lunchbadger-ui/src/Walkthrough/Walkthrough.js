import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import Joyride from 'react-joyride';
import './Walkthrough.scss';

class Walkthrough extends PureComponent {
  static propTypes = {
    steps: PropTypes.array,
  };

  render() {
    const {steps} = this.props;
    return (
      <Joyride
        ref="joyride"
        steps={steps}
        type="continuous"
        run
        debug
        autoStart
        showSkipButton
        showStepsProgress
        disableOverlay
        showBackButton={false}
      />
    );
  }
}

export default Walkthrough;
