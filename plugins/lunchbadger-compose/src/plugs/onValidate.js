import DataSource from '../models/_dataSource';
import Model from '../models/_model';
import Microservice from '../models/_microService';

export default {
  DataSource: DataSource.validate,
  Model: Model.validate,
  Microservice: Microservice.validate,
};
