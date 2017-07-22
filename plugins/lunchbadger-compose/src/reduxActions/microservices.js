// import {actions} from './actions';
//
// export const loadMicroservices = () => async (dispatch, getState) => {
//   dispatch(actions.loadMicroservicesRequest());
//   try {
//     const data = await DataSourceService.load();
//     dispatch(actions.loadMicroservicesSuccess(data));
//   } catch (err) {
//     console.log('ERROR loadDataSourcesFailure', err);
//     dispatch(actions.loadMicroservicesFailure(err));
//   }
// };
