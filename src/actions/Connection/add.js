import {dispatch} from '../../dispatcher/AppDispatcher';
import Connection from 'models/Connection';

export default (from, to) => {
  dispatch('AddConnection', {
    from,
    to
  });
};
