import {saveOrder as saveOrderDataSource} from '../reduxActions/dataSources';
import {saveOrder as saveOrderModel} from '../reduxActions/models';
import {saveOrder as saveOrderMicroservice} from '../reduxActions/microservices';
import {saveOrder as saveOrderFunction} from '../reduxActions/functions';

export default [
  saveOrderDataSource,
  saveOrderModel,
  saveOrderMicroservice,
  saveOrderFunction,
];
