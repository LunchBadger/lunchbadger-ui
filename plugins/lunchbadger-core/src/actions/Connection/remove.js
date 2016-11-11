import {dispatch} from '../../dispatcher/AppDispatcher';

export default (info) => {
  dispatch('RemoveConnection', {
    from: info.sourceId,
    to: info.targetId
  });
};
