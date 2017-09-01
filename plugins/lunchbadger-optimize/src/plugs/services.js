import * as services from '../services';

export default Object.keys(services).map(key => services[key]);
