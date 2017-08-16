import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

registerPlugin(reducers, plugs);
