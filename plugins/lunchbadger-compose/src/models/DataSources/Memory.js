import DataSource from './DataSourceBaseModel';

export default class Memory extends DataSource {

  recreate() {
    return Memory.create(this);
  }

  get isZoomDisabled() {
    return true;
  }

}
