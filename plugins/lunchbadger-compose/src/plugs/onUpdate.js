import {updateDataSource} from '../reduxActions/dataSources';
import {updateModel} from '../reduxActions/models';
import {updateMicroservice} from '../reduxActions/microservices';

export default {
  DataSource: updateDataSource,
  Model: updateModel,
  Microservice: updateMicroservice,
};
