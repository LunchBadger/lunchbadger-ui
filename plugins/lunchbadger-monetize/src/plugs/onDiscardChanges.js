import {discardAPIChanges} from '../reduxActions/apis';
import {discardPortalChanges} from '../reduxActions/portals';

export default {
  API: discardAPIChanges,
  Portal: discardPortalChanges,
};
