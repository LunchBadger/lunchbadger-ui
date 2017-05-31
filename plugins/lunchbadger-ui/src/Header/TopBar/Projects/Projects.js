import React, {Component} from 'react';
import {IconSVG, ContextualMenu} from '../../../';
import {iconPlane} from '../../../../../../src/icons';
import './Projects.scss';

const menu = [
  'New',
  'Open...',
  'Recent',
  'Duplicate',
  'Revert',
];

class Projects extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuVisible: false,
    };
  }

  toggleMenu = menuVisible => () => this.setState({menuVisible});

  render() {
    const {menuVisible} = this.state;
    return (
      <div
        className="Projects"
        onMouseEnter={this.toggleMenu(true)}
        onMouseLeave={this.toggleMenu(false)}
      >
        <IconSVG className="Projects__icon" svg={iconPlane} />
        Projects
        {menuVisible && (
          <ContextualMenu options={menu}/>
        )}
      </div>
    );
  }
}

export default Projects;
