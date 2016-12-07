import API from '../../../models/API';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default () => {
  dispatch('AddAPI', {
    entity: API.create({
      name: 'API'
    })
  });
};
