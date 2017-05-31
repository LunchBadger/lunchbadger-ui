import React, {Component} from 'react';
import {ContextualMenu} from '../../../';
import './Project.scss';

const menu = [
  'Project 01',
  'Test Stuff',
  'Google API',
  'Widget Salestool',
  'Tennis Stats',
];

class Project extends Component {
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
        className="Project"
        onMouseEnter={this.toggleMenu(true)}
        onMouseLeave={this.toggleMenu(false)}
      >
        Project 01
        {menuVisible && (
          <ContextualMenu options={menu}/>
        )}
      </div>
    );
  }
}

export default Project;
