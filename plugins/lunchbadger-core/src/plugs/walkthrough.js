export default {
  '000': {
    title: 'Navigating the Entity Palette',
    text: 'On the left-hand side of the Canvas, you\'ll see the Entity Palette Menu. Clicking any one of these icons will create an Entity in its associated quadrant.',
    selector: '.Aside',
    position: 'right',
  },
  '901': {
    title: 'Wrap-up',
    text: `
Now that you\'re armed with the basics of how to use Express Serverless Platform, have fun!
Feel free to play around with Entities on the Canvas and check Documentation site under this icon.
`,
    selector: '.header__menu__link.documentation',
    position: 'right',
    allowClicksThruHole: false,
  },
  '902': {
    title: `
We're here to help you!
`,
    text: `
Direct any questions via chat here or to your Express Serverless Platform Support Team at <a href="mailto:support@lunchbadger.com" target="_blank">support@lunchbadger.com</a>.
`,
    selector: '#drift-widget',
    position: 'top',
    allowClicksThruHole: false,
  },
  '903': {
    title: 'Settings',
    text: `
Click this icon to open Settings.
`,
    selector: '.header__menu__link.SETTINGS_PANEL',
    position: 'right',
    allowClicksThruHole: true,
    skipLastStep: true,
    triggerNext: api => [
      api.waitUntilNotPresent('.SettingsPanel[style="height: 0px;"]'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(1500),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
  },
  '904': {
    title: 'Restart Walkthrough',
    text: `
You can restart the walkthrough process here.
<br />
All entities will be removed from the canvas.
`,
    waitForSelector: '.RestartWalkthrough',
    position: 'bottom-left',
    allowClicksThruHole: false,
    skipLastStep: true,
    onBefore: () => [],
  },
  '905': {
    title: 'Close Settings',
    text: `
Let's end the walkthrough by closing Settings.
`,
    selector: '.header__menu__link.SETTINGS_PANEL',
    position: 'left',
    allowClicksThruHole: true,
    triggerNext: api => [
      api.waitUntilPresent('.SettingsPanel[style="height: 0px;"]'),
      api.setShowOverlay(false),
      api.setShowTooltip(false),
      api.wait(1500),
      api.setShowTooltip(true),
      api.setShowOverlay(true),
    ],
    onBefore: () => [],
  }
}
