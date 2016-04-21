import {dispatch} from 'dispatcher/AppDispatcher';

export default (from, to, newTo, info) => {
  dispatch('MoveConnection', {
    from,
    to,
    newTo,
    info
  });
};
