import {actions} from './actions';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';
import {DEFAULT_PROJECT_NAME} from '../utils/userStorage';
import {sortStrings} from '../ui/utils';

export const loadSharedProjects = () => dispatch => {
  const {sub} = getUser().profile;
  const usernames = [...Config.get('fakeSharedProjectUsernames')];
  if (!usernames.includes(sub)) {
    usernames.push(sub);
  }
  const projects = usernames.map(username => ({
    username,
    projects: [{name: DEFAULT_PROJECT_NAME}],
  }));
  const sharedProjects = [
    ...projects.filter(p => p.username === sub),
    ...projects
      .filter(p => p.username !== sub)
      .sort(sortStrings('username')),
  ];
  dispatch(actions.loadSharedProjects(sharedProjects));
}
