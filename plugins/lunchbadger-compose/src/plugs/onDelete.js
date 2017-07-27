import {deleteDataSource} from '../reduxActions/dataSources';
import {deleteModel} from '../reduxActions/models';
import {deleteMicroservice} from '../reduxActions/microservices';

export default {
  DataSource: deleteDataSource,
  Model: deleteModel,
  Microservice: deleteMicroservice,
};
