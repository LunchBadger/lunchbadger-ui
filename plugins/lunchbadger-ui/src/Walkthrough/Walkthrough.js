import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import Joyride from 'react-joyride';
import series from 'async/series';
import userStorage from '../../../lunchbadger-core/src/utils/userStorage';
import './Walkthrough.scss';

const locale = {
  back: 'Back',
  close: 'Close',
  last: 'Got it',
  next: 'Next',
  skip: 'Exit Walkthrough',
};

const blockedKeyCodes = [
  9,  // tab
  13  // enter
];

export let blockedEscapingKeys = [false];

class Walkthrough extends PureComponent {
  static propTypes = {
    steps: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      run: true,
      showNextButton: true,
      showOverlay: true,
      showTooltip: true,
      overlayBack: false,
      index: 0,
      allowClicksThruHole: false,
    };
    this.waitMethod = 'waitByAnimationFrame';
  }

  handleCallback = async ({type, index, step}) => {
    if (type === 'finished') {
      this.unblockEscapingKeys();
      userStorage.set('walkthroughShown', true);
      this.joyride.reset(true);
    }
    this.setState({index});
    if (type === 'step:before') {
      this.setState({
        showNextButton: !step.triggerNext,
        allowClicksThruHole: !!step.allowClicksThruHole,
      });
      if (step.onBefore) {
        if (step.rootUrlReplacement) {
          step.text = step.text
            .replace(/\$ROOT_URL/g, this.getRootUrl())
            .replace(/\$USER_ID/g, this.props.userId);

        }
        if (step.waitForSelector) {
          step.selector = step.waitForSelector;
        }
        await series([
          this.api.setRun(false),
          ...step.onBefore(this.api),
          this.api.setRun(true),
        ]);
      }
      if (step.triggerNext) {
        const actions = step.triggerNext(this.api);
        await series(actions, () => this.joyride.next());
      } else {
        this.api.focusNext()(() => {});
      }
    }
    if (type === 'step:after' && step.onAfter) {
      await series([
        this.api.setRun(false),
        ...step.onAfter(this.api),
        this.api.setRun(true),
      ]);
    }
  };

  api = {
    setRun: run => cb => this.setState({run}, cb),
    setShowOverlay: showOverlay => cb => this.setState({showOverlay}, cb),
    setShowTooltip: showTooltip => cb => this.setState({showTooltip}, cb),
    setOverlayBack: overlayBack => cb => this.setState({overlayBack}, cb),
    click: selector => cb => series([
      this.api.waitUntilPresent(selector),
      cb => {
        document.querySelector(selector).click();
        cb();
      },
      () => cb(),
    ]),
    focus: selector => cb => series([
      this.api.waitUntilPresent(selector),
      cb => {
        document.querySelector(selector).focus();
        cb();
      },
      () => cb(),
    ]),
    blur: selector => cb => series([
      this.api.waitUntilPresent(selector),
      cb => {
        document.querySelector(selector).blur();
        cb();
      },
      () => cb(),
    ]),
    focusNext: () => cb => series([
      this.api.wait(100),
      this.api.focus('.joyride-tooltip__button--primary'),
      () => cb(),
    ]),
    waitUntilPresent: (selector, blockEscapingKeys = true) => async cb => {
      blockEscapingKeys && this.blockEscapingKeys();
      while (document.querySelector(selector) === null) {
        await this[this.waitMethod](500);
      }
      blockEscapingKeys && this.unblockEscapingKeys();
      cb();
    },
    waitUntilNotPresent: selector => async cb => {
      while (document.querySelector(selector) !== null) {
        await this[this.waitMethod](500);
      }
      cb();
    },
    setWaitMethod: (waitMethod = 'waitByAnimationFrame') => cb => {
      this.waitMethod = waitMethod;
      cb();
    },
    save: () => cb => series([
      this.api.click('.fa-floppy-o'),
      () => cb(),
    ]),
    waitUntilLoadersGone: () => cb => series([
      this.api.setWaitMethod('waitBySetTimeout'),
      this.api.waitUntilPresent('.spinner__overlay'),
      this.api.waitUntilNotPresent('.spinner__overlay'),
      this.api.setWaitMethod(),
      () => cb(),
    ]),
    waitUntilProjectSaved: () => cb => series([
      this.api.waitUntilLoadersGone(),
      () => cb(),
    ]),
    openEntitySubmenu: kind => cb => series([
      this.api.click(`.Tool.${kind} .Tool__box`),
      this.api.waitUntilPresent('div[role=presentation]'),
      this.api.wait(500),
      () => cb(),
    ]),
    setTextValue: (selector, value) => cb => series([
      this.api.waitUntilPresent(selector),
      callback => window.dispatchEvent(new CustomEvent('changeInputText', {detail: {selector, value, callback}})),
      () => cb(),
    ]),
    setSelectValue: (selector, value) => cb => series([
      this.api.waitUntilPresent(selector),
      callback => window.dispatchEvent(new CustomEvent('changeInputSelect', {detail: {selector, value, callback}})),
      () => cb(),
    ]),
    setCanvasEntityName: (entity, name) => this.api.setTextValue(`.Entity.${entity} .input__name`, name),
    connectPorts: (from, to) => cb => series([
      callback => window.dispatchEvent(new CustomEvent('connectPorts', {detail: {from, to, callback}})),
      this.api.waitUntilProjectSaved(),
      () => cb(),
    ]),
    addEntity: entity => this.api.click(`.Tool.${entity} .Tool__box`),
    addEntityViaSubmenu: entity => this.api.click(`.Tool__submenuItem.${entity}`),
    submitCanvasEntity: entity => cb => series([
      this.api.click(`.Entity.${entity}.editable .submit`),
      this.api.waitUntilProjectSaved(),
      () => cb(),
    ]),
    openEntityDetails: (entity, tab = 'zoom', timeout = 1000) => cb => series([
      this.api.click(`.Entity.${entity}`),
      this.api.click(`.Entity.${entity} .Toolbox__button--${tab}`),
      this.api.waitUntilPresent('.RnD__content'),
      this.api.wait(timeout),
      () => cb(),
    ]),
    discardEntityDetails: () => cb => series([
      this.api.click('.DetailsPanel .cancel'),
      this.api.waitUntilNotPresent('.DetailsPanel.visible'),
      this.api.wait(500),
      () => cb(),
    ]),
    deployGateway: entity => cb => series([
      this.api.submitCanvasEntity(entity),
      this.api.setWaitMethod('waitBySetTimeout'),
      this.api.waitUntilPresent(`.CanvasElement.${entity}.deploying`),
      this.api.waitUntilNotPresent(`.CanvasElement.${entity}.deploying`),
      this.api.setWaitMethod(),
      this.api.waitUntilLoadersGone(),
      () => cb(),
    ]),
    wait: timeout => async cb => {
      await new Promise(r => setTimeout(r, timeout));
      cb();
    },
    setStepText: text => cb => {
      this.props.steps[this.state.index].text = text;
      this.forceUpdate(cb);
    },
    blockClicks: () => cb => {
      document.addEventListener('click', this.stopClickPropagation);
      cb();
    },
    unblockClicks: () => cb => {
      document.removeEventListener('click', this.stopClickPropagation);
      cb();
    },
  };

  getRootUrl = () => document.querySelector('.Entity.ApiEndpoint .accessUrl a').innerHTML;

  stopClickPropagation = event => {
    event.preventDefault();
    event.stopPropagation();
  };

  blockEscapingKeys = () => {
    document.addEventListener('keydown', this.stopEscapingKeys);
    blockedEscapingKeys[0] = true;
  };

  unblockEscapingKeys = () => {
    document.removeEventListener('keydown', this.stopEscapingKeys);
    blockedEscapingKeys[0] = false;
  };

  stopEscapingKeys = event => {
    if (blockedKeyCodes.includes(event.keyCode) || blockedKeyCodes.includes(event.which)) {
      event.preventDefault();
      event.stopPropagation();
    }
  };

  waitByAnimationFrame = () => new Promise(resolve => requestAnimationFrame(resolve));

  waitBySetTimeout = timeout => new Promise(res => setTimeout(res, timeout));

  render() {
    const {
      steps,
      loadedProject,
      emptyProject,
    } = this.props;
    const {
      run,
      showNextButton,
      showOverlay,
      showTooltip,
      overlayBack,
      allowClicksThruHole,
      index,
    } = this.state;
    const showWalkthrough = loadedProject && emptyProject && !userStorage.get('walkthroughShown');
    if (!showWalkthrough && index === 0) return <div />;
    return (
      <div className={cs('Walkthrough', {showNextButton, showTooltip, overlayBack})}>
        <Joyride
          ref={r => this.joyride = r}
          steps={steps}
          type="continuous"
          run={run}
          showOverlay={showOverlay}
          autoStart
          showSkipButton
          showStepsProgress={false}
          disableOverlay
          showBackButton={false}
          callback={this.handleCallback}
          locale={locale}
          allowClicksThruHole={allowClicksThruHole}
          keyboardNavigation={false}
        />
      </div>
    );
  }
}

const selector = createSelector(
  state => state.entities,
  state => state.plugins.quadrants,
  state => state.loadedProject,
  (
    entities,
    quadrants,
    loadedProject,
  ) => {
    let emptyProject = true;
    Object.values(quadrants).forEach((quadrant) => {
      quadrant.entities.forEach((type) => {
        if (Object.keys(entities[type]).length) {
          emptyProject = false;
        }
      });
    });
    return {
      emptyProject,
      loadedProject,
    };
  },
);

export default connect(selector)(Walkthrough);
