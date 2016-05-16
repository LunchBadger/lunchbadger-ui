import APICreature from 'models/APICreature';
import Upgrade from 'models/Upgrade';

const BaseModel = LunchBadgerCore.models.BaseModel;

const defaultCreatures = [
  APICreature.create({
    name: 'User Pool',
    icon: 'fa-user'
  }),
  APICreature.create({
    name: 'Minnow',
    icon: 'fa-paper-plane'
  }),
  APICreature.create({
    name: 'Dolhpin',
    icon: 'fa-plane'
  }),
  APICreature.create({
    name: 'Whale',
    icon: 'fa-fighter-jet'
  })
];

export default class APIForecast extends BaseModel {
  static type = 'APIForecast';

  /**
   * @type {APIForecast[]}
   * @private
   */
  _creatures = [];
  _upgrades = [];

  constructor(id, name, apiId, left, top) {
    super(id);

    this.name = name;
    this.apiId = apiId;
    this.left = left;
    this.top = top;

    this.creatures = defaultCreatures;
    this.upgrades = [];
  }

  /**
   * @param creatures {Creature[]}
   */
  set creatures(creatures) {
    this._creatures = creatures;
  }

  /**
   * @returns {Creature[]}
   */
  get creatures() {
    return this._creatures;
  }

  /**
   * @param creature {Creature}
   */
  addCreature(creature) {
    this._creatures.push(creature);
  }

  /**
   * @param upgrades {Upgrades[]}
   */
  set upgrades(upgrades) {
    this._upgrades = upgrades;
  }

  /**
   * @returns {Upgrades[]}
   */
  get upgrades() {
    return this._upgrades;
  }

  /**
   * @param Upgrade {Upgrade}
   */
  addUpgrade(upgrade) {
    this._upgrades.push(upgrade);
  }
}
