import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import Joyride from 'react-joyride';
import series from 'async/series';
import {cloneDeep} from 'lodash';
import userStorage from '../../utils/userStorage';
import OneOptionModal from '../../components/Generics/Modal/OneOptionModal';
import {GAEvent} from '../GA/GA';
import {scrollToElement} from '../';
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

class WalkthroughInner extends PureComponent {
  static propTypes = {
    steps: PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = this.initState(props);
    this.stepsExecuted = {};
    this.skipedLastStep = 1;
    this.stepsOffset = userStorage.getNumber('walkthroughLastStep');
  }

  componentDidMount() {
    window.addEventListener('walkthroughRestarted', this.onWalkthroughRestart);
  }

  componentWillUnmount() {
    window.removeEventListener('walkthroughRestarted', this.onWalkthroughRestart);
  }

  onWalkthroughRestart = () => {
    userStorage.remove('walkthroughLastStep');
    this.stepsExecuted = {};
    this.skipedLastStep = 1;
    this.setState(this.initState());
    this.restarted = true;
    this.stepsOffset = 0;
  };

  initState = (props = this.props) => {
    this.waitMethod = 'waitByAnimationFrame';
    this.steps = cloneDeep(props.steps);
    const walkthroughLastStep = userStorage.getNumber('walkthroughLastStep');
    if (walkthroughLastStep > 0) {
      this.steps = this.steps.splice(walkthroughLastStep, this.steps.length - walkthroughLastStep);
    }
    return {
      run: true,
      showNextButton: true,
      showOverlay: true,
      showTooltip: true,
      overlayBack: false,
      index: 0,
      allowClicksThruHole: false,
    };
  };

  exitWalkthrough = () => {
    userStorage.remove('walkthroughLastStep');
    userStorage.set('walkthroughShown', true);
  }

  handleCallback = async ({type, index, step}) => {
    if (type === 'finished') {
      if (this.onExit) {
        series(this.onExit(this.api));
      }
      const lastStepTitle = this.steps[this.state.index].title;
      const lastStepIdx = userStorage.getNumber('walkthroughLastStep');
      if (this.steps.length - 1 === this.state.index) {
        GAEvent('Walkthrough', 'Finished');
      } else {
        GAEvent('Walkthrough', 'Clicked Exit', lastStepTitle, lastStepIdx);
      }
      this.exitWalkthrough();
      this.unblockEscapingKeys();
      this.joyride.reset(true);
    }
    this.setState({index});
    // if (type === 'step:after') { // removed by 877
    //   GAEvent('Walkthrough', 'Clicked Next', step.title, index + this.stepsOffset);
    // }
    if (type === 'step:before') {
      this.onExit = step.onExit;
      this.setState({
        showNextButton: !step.triggerNext,
        allowClicksThruHole: !!step.allowClicksThruHole,
      });
      if (index === 0 && step.onPageReload) {
        if (!this.stepsExecuted[`${type}-${index}-onPageReload`]) {
          this.stepsExecuted[`${type}-${index}-onPageReload`] = true;
          await series(step.onPageReload(this.api));
        }
      }
      if (step.onBefore) {
        if (step.waitForSelector) {
          step.selector = step.waitForSelector;
        }
        if (!this.stepsExecuted[`${type}-${index}`]) {
          this.stepsExecuted[`${type}-${index}`] = true;
          await series([
            this.api.setRun(false),
            ...step.onBefore(this.api),
            this.api.setRun(true),
          ]);
        }
      }
      if (step.triggerNext) {
        const actions = step.triggerNext(this.api);
        await series(actions, () => {
          if (this.joyride && !this.stepsExecuted[`${type}-${index}-next`]) {
            if (!step.unblockNext) {
              this.stepsExecuted[`${type}-${index}-next`] = true;
            }
            this.joyride && this.joyride.next();
          }
        });
      } else {
        this.api.focusNext()(() => {});
      }
    }
    if (type === 'step:after') {
      if (step.onAfter) {
        if (!this.stepsExecuted[`${type}-${index}`]) {
          this.stepsExecuted[`${type}-${index}`] = true;
          await series([
            this.api.setRun(false),
            ...step.onAfter(this.api),
            this.api.setRun(true),
          ]);
        }
      }
      if (step.skipLastStep) {
        this.skipedLastStep += 1;
      } else {
        const walkthroughLastStep = userStorage.getNumber('walkthroughLastStep');
        userStorage.set('walkthroughLastStep', walkthroughLastStep + this.skipedLastStep);
        this.props.onStepChange(userStorage.getNumber('walkthroughLastStep'));
        this.skipedLastStep = 1;
      }
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
    beforeScroll: () => cb => this.setState({
      showOverlay: false,
      showTooltip: false,
    }, () => setTimeout(cb, 500)),
    afterScroll: () => cb => this.setState({
      showOverlay: true,
      showTooltip: true,
    }, cb),
    autoscroll: (selector) => cb => {
      scrollToElement(document.querySelector(selector));
      setTimeout(cb, 500);
    },
    callGAEvent: (eventAction, eventLabel, eventValue) => cb => {
      GAEvent('Walkthrough', eventAction, eventLabel, eventValue);
      cb();
    },
    setHoleWidth: (portOutSelector, portInSelector) => cb => {
      const portOut = document.querySelector(portOutSelector);
      const {left} = portOut.getBoundingClientRect();
      const {right} = document.querySelector(portInSelector).getBoundingClientRect();
      portOut.style.width = `${Math.round(right - left)}px`;
      cb();
    },
    setHoleSize: (portOutSelector, portInSelector) => cb => {
      const portOut = document.querySelector(portOutSelector);
      const {left, bottom} = portOut.getBoundingClientRect();
      const {right, top} = document.querySelector(portInSelector).getBoundingClientRect();
      portOut.style.width = `${Math.round(right - left)}px`;
      portOut.style.height = `${Math.round(bottom - top)}px`;
      cb();
    },
    clearHoleSize: (portOutSelector) => cb => {
      const portOut = document.querySelector(portOutSelector)
      portOut.style.width = 'auto';
      portOut.style.height = 'auto';
      cb();
    },
    togglePortWrapper: (portSelector, action, className) => cb => {
      document.querySelector(portSelector).classList[action](className);
      cb();
    },
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
    waitForTextareaContent: (selector, content, blockEscapingKeys = true) => async cb => {
      blockEscapingKeys && this.blockEscapingKeys();
      while (document.querySelector(selector).value.replace(/\s/g, '') !== content) {
        await this[this.waitMethod](500);
      }
      blockEscapingKeys && this.unblockEscapingKeys();
      cb();
    },
    delayOverlay: timeout => cb => series([
      this.api.setShowOverlay(false),
      this.api.setShowTooltip(false),
      this.api.wait(timeout),
      this.api.setShowTooltip(true),
      this.api.setShowOverlay(true),
      () => cb(),
    ]),
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
    disconnectPorts: (from, to) => cb => series([
      callback => window.dispatchEvent(new CustomEvent('disconnectPorts', {detail: {from, to, callback}})),
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
      this.steps[this.state.index].text = text;
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
    getReplacement: id => ({
      ROOT_URL: this.getRootUrl(),
      USER_ID: this.props.userId,
    })[id],
    setHole: styles => cb => {
      setTimeout(() => {
        const holeElement = document.querySelector('.joyride-hole');
        for (let style in styles) {
          const val = styles[style];
          if (val < 0) {
            holeElement.style[style] = `${+holeElement.style[style].replace('px', '') + val}px`;
          } else {
            holeElement.style[style] = val;
          }
        }
        cb();
      });
    },
    addClass: (selector, className) => cb => {
      setTimeout(() => {
        document.querySelector(selector).classList.add(className);
        cb();
      })
    },
    removeClass: (selector, className) => cb => {
      setTimeout(() => {
        document.querySelector(selector).classList.remove(className);
        cb();
      })
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
    const {steps} = this;
    const {
      loadedProject,
      loadingProject,
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
    const showWalkthrough = loadedProject
      && !loadingProject
      && (emptyProject || (!emptyProject && userStorage.exists('walkthroughLastStep')))
      && !userStorage.get('walkthroughShown');
    const showWaitingScreen = loadedProject
      && !emptyProject
      && !userStorage.get('walkthroughShown')
      && this.restarted;
    if (showWaitingScreen && !index) return (
      <OneOptionModal
        title="Waiting for Walkthrough"
        // confirmText="Discard Walkthrough"
        // onClose={this.exitWalkthrough}
      >
        Please wait, until all entities will be removed from the canvas.
      </OneOptionModal>
    );
    if (!showWalkthrough && !index) return <div />;
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
  state => state.loadingProject,
  (
    entities,
    quadrants,
    loadedProject,
    loadingProject,
  ) => {
    let emptyProject = true;
    Object.values(quadrants).forEach((quadrant) => {
      quadrant.entities.forEach((type) => {
        if (Object.values(entities[type]).filter(({deleting}) => !deleting).length) {
          emptyProject = false;
        }
      });
    });
    return {
      emptyProject,
      loadedProject,
      loadingProject,
    };
  },
);

export default connect(selector)(WalkthroughInner);
