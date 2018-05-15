import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import cs from 'classnames';
import Joyride from 'react-joyride';
import series from 'async/series';
import './Walkthrough.scss';

const locale = {
  back: 'Back',
  close: 'Close',
  last: 'Got it',
  next: 'Next',
  skip: 'Skip',
};

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
    this.showed = !props.emptyProject;
  }

  handleCallback = async ({type, index, step}) => {
    if (type === 'finished') {
      localStorage.setItem('walkthroughShown', true);
    }
    this.setState({index});
    if (type === 'step:before') {
      this.setState({
        showNextButton: !step.triggerNext,
        allowClicksThruHole: !!step.allowClicksThruHole,
      });
      if (step.triggerNext) {
        const actions = step.triggerNext(this.api);
        await series(actions, () => this.joyride.next());
      }
      if (step.onBefore) {
        if (step.waitForSelector) {
          step.selector = step.waitForSelector;
        }
        series([
          this.api.setRun(false),
          ...step.onBefore(this.api),
          this.api.setRun(true),
        ]);
      }
    }
    if (type === 'step:after' && step.onAfter) {
      series([
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
    unselectEntities: () => cb => series([
      this.api.click('.quadrant__title'),
      this.api.waitUntilNotPresent('.Entity.highlighted'),
      () => cb(),
    ]),
    waitUntilPresent: selector => async cb => {
      while (document.querySelector(selector) === null) {
        await this.rafAsync();
      }
      cb();
    },
    waitUntilNotPresent: selector => async cb => {
      while (document.querySelector(selector) !== null) {
        await this.rafAsync();
      }
      cb();
    },
    save: () => cb => series([
      this.api.click('.fa-floppy-o'),
      () => cb(),
    ]),
    waitUntilLoadersGone: () => cb => series([
      this.api.waitUntilPresent('.spinner__overlay'),
      this.api.waitUntilNotPresent('.spinner__overlay'),
      () => cb(),
    ]),
    waitUntilProjectSaved: () => cb => series([
      this.api.waitUntilLoadersGone(),
      this.api.click('.SystemInformationMessages .SystemInformationMessages__item.All-data-has-been-synced-with-API .SystemInformationMessages__item__delete'),
      this.api.waitUntilNotPresent('.SystemInformationMessages .SystemInformationMessages__item.All-data-has-been-synced-with-API'),
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
      this.api.waitUntilPresent(`.CanvasElement.${entity}.deploying`),
      this.api.waitUntilNotPresent(`.CanvasElement.${entity}.deploying`),
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
  };

  rafAsync = () => new Promise(resolve => requestAnimationFrame(resolve));

  render() {
    const {steps} = this.props;
    const {
      run,
      showNextButton,
      showOverlay,
      showTooltip,
      overlayBack,
      allowClicksThruHole,
    } = this.state;
    if (this.showed) return <div />;
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
  (
    entities,
    quadrants,
  ) => {
    let emptyProject = true;
    Object.values(quadrants).forEach((quadrant) => {
      quadrant.entities.forEach((type) => {
        if (Object.keys(entities[type]).length) {
          emptyProject = false;
        }
      });
    })
    return {
      emptyProject,
    };
  },
);

export default connect(selector)(Walkthrough);
