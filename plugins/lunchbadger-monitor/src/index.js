// import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';
import plugs from './plugs';

const {registerPlugin} = LunchBadgerCore.utils;
registerPlugin(reducers, plugs);
