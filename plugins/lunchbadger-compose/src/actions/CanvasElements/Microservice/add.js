import Microservice from '../../../models/Microservice'

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  dispatch('AddMicroservice', {
    entity: Microservice.create({
      name: name || 'Microservice',
      ready: true
    })
  });
};
