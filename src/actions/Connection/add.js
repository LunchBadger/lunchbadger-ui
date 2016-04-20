import {dispatch} from '../../dispatcher/AppDispatcher';

export default (from, to) => {
  dispatch('AddConnection', {
    from,
    to
  });
};
