import {request} from 'graphql-request';
import Config from '../../../../src/config';
import {getUser} from '../utils/auth';

class GraphqlService {
  loadSharedProjects = () => request(Config.get('graphqlApiUrl'),
    `{
      loadSharedProjects(
        username: "${getUser().profile.sub}"
      ) {
        username,
        sharedProjects {
          username,
          projects {
            name,
            permissions {
              admin,
              push,
              pull
            }
          }
      	}
      }
    }`
  );
}

export default new GraphqlService();
