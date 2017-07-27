import {discardDataSourceChanges} from '../reduxActions/dataSources';
import {discardModelChanges} from '../reduxActions/models';
import {discardMicroserviceChanges} from '../reduxActions/microservices';

export default {
  DataSource: discardDataSourceChanges,
  Model: discardModelChanges,
  Microservice: discardMicroserviceChanges,
};
