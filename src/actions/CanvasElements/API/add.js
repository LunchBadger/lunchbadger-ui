import API from 'models/API';

const {dispatch} = LBCore.dispatcher.AppDispatcher;

export default () => {
  dispatch('AddAPI', {
    API: API.create({
      name: 'API'
    })
  });
};
