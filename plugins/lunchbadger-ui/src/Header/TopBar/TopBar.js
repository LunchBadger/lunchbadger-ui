import React from 'react';
import Projects from './Projects/Projects';
import Project from './Project/Project';
import User from './User/User';

import './TopBar.scss';

const TopBar = () => (
  <div className="TopBar">
    <div className="TopBar__projects">
      <Projects />
    </div>
    <div className="TopBar__project">
      <Project />
    </div>
    <div className="TopBar__user">
      <User />
    </div>
  </div>
);

export default TopBar;
