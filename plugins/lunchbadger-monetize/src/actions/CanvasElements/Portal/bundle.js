import update from './update';

const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;

export default (portal, api) => {
  update(portal.id, {});

  dispatch('BundlePortal', {
    portal,
    api
  });
};
