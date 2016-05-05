import App from './components/App/App';
import BaseTools from './plugs/BaseTools';

LBCore.actions.registerPlugin(BaseTools);

// export
let LBBase = {
  components: {
    App: App
  }
};

if (!global.exports && !global.module && (!global.define || !global.define.amd)) {
  global.LBBase = LBBase;
}

module.exports = LBBase;
