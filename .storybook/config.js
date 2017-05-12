import React from 'react';
import { configure, addDecorator } from '@kadira/storybook';

addDecorator((story) => (
  <div className="story">
    {story()}
  </div>
));

function loadStories() {
  require('../stories/index.js');
}

configure(loadStories, module);
