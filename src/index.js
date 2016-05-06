// Let's register plugins inside the Core, yay!
import ManagePlugin from './plugs/ManagePlugin';

// models
import PublicEndpoint from './models/PublicEndpoint';

LunchBadgerCore.actions.registerPlugin(ManagePlugin);

// export
let LunchBadgerManage = {
  models: {
    PublicEndpoint: PublicEndpoint
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LunchBadgerManage = LunchBadgerManage;
}

module.exports = LunchBadgerManage;
