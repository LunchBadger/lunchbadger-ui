import Portal from '../../../models/Portal';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (name) => {
  const portal = Portal.create({name: name || 'Portal'});

  setTimeout(() => {
    dispatch('DeployPortalSuccess', {
      portal
    });
  }, 1500);

  dispatch('AddPortal', {
    portal
  });
};
