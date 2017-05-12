import React from 'react';
import {configure, addDecorator, setAddon} from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';

setAddon(infoAddon);

addDecorator((story) => (
  <div className="story">
    {story()}
  </div>
));

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
