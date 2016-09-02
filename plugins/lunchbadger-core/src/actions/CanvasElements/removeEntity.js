import {dispatch} from '../../dispatcher/AppDispatcher';

export default (entity) => {
  dispatch('RemoveEntity', {
    entity
  });
}
