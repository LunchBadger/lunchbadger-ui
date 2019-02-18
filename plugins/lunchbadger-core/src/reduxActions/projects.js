import {actions} from './actions';
// import {addSystemDefcon1} from './systemDefcon1';
import GraphqlService from '../services/GraphqlService';

export const loadSharedProjects = () => async dispatch => {
  try {
    const data = await GraphqlService.loadSharedProjects();
    if (data && data.loadSharedProjects && data.loadSharedProjects.sharedProjects) {
      dispatch(actions.loadSharedProjects(data.loadSharedProjects.sharedProjects));
    }
  } catch (error) {
    // dispatch(addSystemDefcon1({error}));
  }

}
