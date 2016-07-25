import Portal from 'models/Portal';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  const portal = Portal.create({
    name: name || 'Portal',
    ready: true
  });

  dispatch('AddPortal', {
    portal
  });
};
