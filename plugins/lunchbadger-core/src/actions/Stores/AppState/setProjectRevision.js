import {dispatch} from '../../../dispatcher/AppDispatcher';

export default (revision) => {
  dispatch('SetProjectRevision', {
    revision: revision
  });
}
