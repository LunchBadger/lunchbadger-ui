// import API from '../../../models/API';
// import Portal from '../../../models/Portal';
//
// const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
//
// export default (data) => {
//   const APIs = data.apis;
//   const Portals = data.portals;
//
//   const APIObjects = APIs.map((APIDetails, index) => {
//     return API.create({
//       itemOrder: index,
//       loaded: true,
//       ...APIDetails
//     });
//   });
//
//   const apisCount = APIObjects.length;
//
//   const PortalObjects = Portals.map((PortalDetails, index) => {
//     return Portal.create({
//       itemOrder: index + apisCount,
//       ready: true,
//       loaded: true,
//       ...PortalDetails
//     });
//   });
//
//   dispatch('InitializePublic', {
//     data: [...APIObjects, ...PortalObjects]
//   });
// };
