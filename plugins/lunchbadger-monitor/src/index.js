// Let's register plugins inside the Core, yay!
import MetricsPanel from './plugs/MetricsPanel';

LunchBadgerCore.actions.registerPlugin(MetricsPanel);

import {registerPlugin} from '../../../src/reducers';
import reducers from './reducers';

registerPlugin(reducers);
