import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {createSelector} from 'reselect';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import ArrowDropRight from 'material-ui/svg-icons/navigation-arrow-drop-right';
import {IconButton as Icon} from '../../ui';
import userStorage from '../../utils/userStorage';
import {getUser} from '../../utils/auth';

const menuStyle = {
  fontWeight: 400,
  fontSize: '15px',
  lineHeight: '32px',
};

class ProjectMenu extends PureComponent {

  handleSwitchProject = (activeUsername, activeProject) => () => {
    userStorage.set('activeUsername', activeUsername);
    userStorage.set('activeProject', activeProject);
    document.location.reload();
  }

  getSharedProjectsMenuItems = () => {
    const {sharedProjects} = this.props;
    const activeUsername = userStorage.getActiveUsername();
    const activeProject = userStorage.getActiveProject();
    const menuItems = [];
    sharedProjects.forEach(({username, projects}, idx) => {
      if (idx > 0) {
        menuItems.push(<Divider />);
      }
      const label = username === getUser().profile.sub ? 'My projects' : username;
      menuItems.push(
        <Subheader
          style={menuStyle}
        >
          {label}:
        </Subheader>
      );
      projects.forEach(({name}) => {
        const checked = username === activeUsername && name === activeProject;
        menuItems.push(
          <MenuItem
            primaryText={name}
            checked={checked}
            insetChildren={!checked}
            style={menuStyle}
            value={[username, name]}
            onClick={this.handleSwitchProject(username, name)}
          />
        );
      });
    });
    return menuItems;
  };

  render() {
    const projects = this.getSharedProjectsMenuItems();
    return (
      <IconMenu
        iconButtonElement={<IconButton><Icon icon="iconProject" /></IconButton>}
        anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        onChange={() => {}}
        touchTapCloseDelay={1}
        desktop
        listStyle={menuStyle}
      >
        {/*<MenuItem primaryText="New project" value="" />*/}
        <MenuItem
          primaryText="Switch project"
          rightIcon={<ArrowDropRight />}
          desktop
          menuItems={projects}
        />
      </IconMenu>
    );
  }
}

const selector = createSelector(
  state => state.projects,
  ({sharedProjects, activeUsername, activeProject}) => ({
    sharedProjects,
    activeUsername,
    activeProject,
  }),
);

export default connect(selector)(ProjectMenu);
