import React, {Component} from 'react';
import Popover from 'material-ui/Popover';
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
      open: false,
    };
  }

  toggleMenu = (event) => {
    event.preventDefault();
    this.setState({
      open: true,
      anchorEl: event.currentTarget,
    });
  };

  handleRequestClose = () => {
    this.setState({
      open: false,
    });
  };

  render() {
    const {menuVisible} = this.state;
    return (
      <div
        className="Project"
        onClick={this.toggleMenu}
      >
        Project 01
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          targetOrigin={{horizontal: 'left', vertical: 'top'}}
          onRequestClose={this.handleRequestClose}
        >
          <ContextualMenu options={menu}/>
        </Popover>
      </div>
    );
  }
}

export default Project;
