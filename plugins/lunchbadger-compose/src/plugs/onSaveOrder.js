import {saveOrder as saveOrderDataSource} from '../reduxActions/dataSources';
import {saveOrder as saveOrderModel} from '../reduxActions/models';
import {saveOrder as saveOrderMicroservice} from '../reduxActions/microservices';

export default [
  saveOrderDataSource,
  saveOrderModel,
  saveOrderMicroservice,
];
