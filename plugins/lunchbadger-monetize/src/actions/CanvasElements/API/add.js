import API from '../../../models/API';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default () => {
  dispatch('AddAPI', {
    API: API.create({
      name: 'API'
    })
  });
};
