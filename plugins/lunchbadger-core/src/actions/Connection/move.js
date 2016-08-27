import {dispatch} from 'dispatcher/AppDispatcher';

export default (from, to, newFrom, newTo, info) => {
  dispatch('MoveConnection', {
    from,
    to,
    newFrom,
    newTo,
    info
  });
};
