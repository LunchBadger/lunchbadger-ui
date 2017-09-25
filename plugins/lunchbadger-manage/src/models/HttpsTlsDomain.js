const BaseModel = LunchBadgerCore.models.BaseModel;

export default class HttpsTlsDomain extends BaseModel {
  static type = 'HttpsTlsDomain';

  toJSON() {
    return {
      [this.domain]: {
        key: this.key,
        cert: this.cert,
      },
    };
  }

}
