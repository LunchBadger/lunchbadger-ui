import {dispatch} from 'dispatcher/AppDispatcher';

export default (projectId, projectName) => {
  dispatch('SetProject', {
    project: {
      id: projectId,
      name: projectName
    }
  });
}
