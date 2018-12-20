import React, {Component} from 'react';
import Popover from 'material-ui/Popover';
import {IconSVG, ContextualMenu} from '../../../';
import icons from '../../../icons';
import './Projects.scss';

const {iconPlane} = icons;

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
        className="Projects"
        onClick={this.toggleMenu}
      >
        <IconSVG className="Projects__icon" svg={iconPlane} />
        Projects
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

export default Projects;
