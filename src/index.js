// Let's register plugins inside the Core, yay!
import PublicEndpoint from './models/PublicEndpoint';

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
