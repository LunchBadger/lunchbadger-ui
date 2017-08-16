// import _ from 'lodash';
//
// const {dispatch} = LunchBadgerCore.dispatcher.AppDispatcher;
//
// export default (gateway, newProps) => {
//   setTimeout(() => {
//     dispatch('UpdateGateway', {
//       id: gateway.id,
//       data: {ready: true, ...newProps}
//     });
//   }, 1500);
//
//   _.differenceBy(gateway.pipelines, newProps.pipelines, pl => pl.id)
//     .forEach(pipeline => {
//       dispatch('RemoveEntity', {
//         pipeline,
//       });
//     });
//
//   dispatch('UpdateGateway', {
//     id: gateway.id,
//     data: {ready: false, ...newProps}
//   });
//
// };
