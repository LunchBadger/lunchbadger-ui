import Forecast from 'stores/Forecast';
import ForecastAPI from 'models/ForecastAPI';
import ForecastAPIPlan from 'models/ForecastAPIPlan';
import ForecastTier from 'models/ForecastTier';
import APIForecast from 'models/APIForecast';
import Upgrade from 'models/Upgrade';
import uuid from 'uuid';

const {APIPlan, PlanDetails, TierDetails} = LunchBadgerMonetize.models;

const tierDetails = {
  date: '1/2016',
  conditionFrom: 0,
  conditionTo: 0,
  type: 'fixed',
  value: 0,
  new: true
};

const planDetails = {
  date: '1/2016',
  changed: false,
  subscribers: {
    existing: 100,
    new: 0,
    upgrades: 0,
    downgrades: 0,
    churn: 0
  },
  parameters: {
    callsPerSubscriber: 0,
    cashPerCall: 0
  }
};

describe('Forecast Store', () => {
  let ForecastAPIInstance;
  let APIForecastInstance;

  beforeEach(() => {
    ForecastAPIInstance = ForecastAPI.create({name: 'test'});
    APIForecastInstance = APIForecast.create({api: ForecastAPIInstance});
  });

  afterEach(() => {
    Forecast.empty();
  });

  it('should be empty when initialized', () => {
    expect(Forecast.getData().length).to.equal(0);
  });

  it('should add api entity to store', () => {
    Forecast.addApiForecast(APIForecastInstance);
    expect(Forecast.getData().length).to.equal(1);
  });

  it('should not add entity if entity with same api exists', () => {
    Forecast.addApiForecast(APIForecastInstance);
    Forecast.addApiForecast(APIForecastInstance);

    expect(Forecast.getData().length).to.equal(1);
  });

  it('should find entity', () => {
    Forecast.addApiForecast(APIForecastInstance);

    const found = Forecast.findEntity(APIForecastInstance.id);
    expect(found).to.equal(APIForecastInstance);
    expect(Forecast.findEntity(uuid.v4())).to.be.undefined;
  });

  it('should find entity by api id', () => {
    Forecast.addApiForecast(APIForecastInstance);

    const found = Forecast.findEntityByApiId(APIForecastInstance.api.id);
    expect(found).to.equal(APIForecastInstance);
    expect(Forecast.findEntityByApiId(uuid.v4())).to.be.undefined;
  });

  it('should remove entity', () => {
    Forecast.addApiForecast(APIForecastInstance);
    expect(Forecast.getData().length).to.equal(1);

    Forecast.removeEntity(APIForecastInstance.id);
    expect(Forecast.getData().length).to.equal(0);
  });

  it('should add plan to forecasted api', () => {
    const plan = APIPlan.create({name: 'testPlan'});

    expect(APIForecastInstance.api.plans.length).to.equal(0);

    Forecast.addPlanToApi(APIForecastInstance, plan);

    expect(APIForecastInstance.api.plans.length).to.equal(1);
    expect(APIForecastInstance.api.plans[0].name).to.equal('testPlan');
  });

  it('should add upgrade to forecasted api', () => {
    const upgrade = Upgrade.create({});

    expect(APIForecastInstance.api.upgrades.length).to.equal(0);

    Forecast.addUpgradeToApi(APIForecastInstance, upgrade);

    expect(APIForecastInstance.api.upgrades.length).to.equal(1);
  });

  it('should add tier to forecasted api plan', () => {
    const plan = APIPlan.create({name: 'newPlan'});

    Forecast.addTierToPlan(plan, '1/2016');

    expect(plan.tiers.length).to.equal(1);
    expect(plan.tiers[0].details.length).to.equal(0);

    plan.details = [
      {
        date: '1/2016',
        changed: false,
        subscribers: {
          existing: 0,
          new: 0,
          upgrades: 0,
          downgrades: 0,
          churn: 0
        },
        parameters: {
          callsPerSubscriber: 0,
          cashPerCall: 0
        }
      }
    ];

    Forecast.addTierToPlan(plan, '1/2016');

    expect(plan.details[0].changed).to.equal(true);
  });

  it('should remove tier from forecasted api plan', () => {
    const plan = ForecastAPIPlan.create({name: 'newPlan'});
    const tier = ForecastTier.create({});

    plan.details = [planDetails];
    tier.details = [tierDetails];

    plan.tiers = [tier];

    expect(plan.tiers.length).to.equal(1);
    expect(plan.tiers[0].details.length).to.equal(1);
    expect(plan.details[0].changed).to.equal(false);

    Forecast.removeTierFromPlan(plan, tier, '1/2016');

    expect(plan.tiers.length).to.equal(1);
    expect(plan.tiers[0].details.length).to.equal(0);
    expect(plan.details[0].changed).to.equal(true);
  });

  it('should update tier details', () => {
    const plan = ForecastAPIPlan.create({name: 'newPlan'});
    const tier = ForecastTier.create({});

    plan.details = [planDetails];
    tier.details = [tierDetails];

    expect(tier.details[0].new).to.equal(true);
    expect(tier.details[0].conditionFrom).to.equal(0);
    expect(tier.details[0].conditionTo).to.equal(0);
    expect(tier.details[0].type).to.equal('fixed');
    expect(tier.details[0].value).to.equal(0);
    expect(plan.details[0].changed).to.equal(false);

    Forecast.updateTierDetails(plan, tier, '1/2016', {
      conditionFrom: 10,
      conditionTo: 10,
      type: 'percentage',
      value: 0.1
    });

    expect(tier.details[0].new).to.equal(false);
    expect(tier.details[0].conditionFrom).to.equal(10);
    expect(tier.details[0].conditionTo).to.equal(10);
    expect(tier.details[0].type).to.equal('percentage');
    expect(tier.details[0].value).to.equal(0.1);
    expect(plan.details[0].changed).to.equal(true);
  });

  it('should change upgrade value', () => {
    const fromPlan = ForecastAPIPlan.create({});
    const toPlan = ForecastAPIPlan.create({});
    const upgrade = Upgrade.create({
      fromPlanId: fromPlan.id,
      toPlanId: toPlan.id,
      date: '1/2016',
      value: 10
    });

    fromPlan.details = [planDetails];
    toPlan.details = [planDetails];

    expect(fromPlan.details[0].changed).to.equal(false);
    expect(toPlan.details[0].changed).to.equal(false);

    ForecastAPIInstance.plans = [fromPlan, toPlan];
    ForecastAPIInstance.addUpgrade(upgrade);

    Forecast.changeUpgradeValue(APIForecastInstance, fromPlan.id, toPlan.id, 50, '1/2016');

    expect(upgrade.value).to.equal(50);
    expect(fromPlan.details[0].changed).to.equal(true);
    expect(toPlan.details[0].changed).to.equal(true);
  });

  it('should change upgrade value (new users)', () => {
    const toPlan = ForecastAPIPlan.create({});
    const upgrade = Upgrade.create({
      fromPlanId: null,
      toPlanId: toPlan.id,
      date: '1/2016',
      value: 10
    });

    toPlan.details = [planDetails];

    expect(toPlan.details[0].changed).to.equal(false);

    ForecastAPIInstance.plans = [toPlan];
    ForecastAPIInstance.addUpgrade(upgrade);

    Forecast.changeUpgradeValue(APIForecastInstance, null, toPlan.id, 50, '1/2016');

    expect(upgrade.value).to.equal(50);
    expect(toPlan.details[0].changed).to.equal(true);
  });

  it('should change upgrade value (churn users)', () => {
    const fromPlan = ForecastAPIPlan.create({});
    const upgrade = Upgrade.create({
      fromPlanId: fromPlan.id,
      toPlanId: null,
      date: '1/2016',
      value: 10
    });

    fromPlan.details = [planDetails];

    expect(fromPlan.details[0].changed).to.equal(false);

    ForecastAPIInstance.plans = [fromPlan];
    ForecastAPIInstance.addUpgrade(upgrade);

    Forecast.changeUpgradeValue(APIForecastInstance, fromPlan.id, null, 50, '1/2016');

    expect(upgrade.value).to.equal(50);
    expect(fromPlan.details[0].changed).to.equal(true);
  });

  it('should recalculate forecast base', () => {
    const plan = ForecastAPIPlan.create({});

    plan.details = [
      planDetails,
      {
        ...planDetails,
        date: '2/2016'
      }
    ];

    ForecastAPIInstance.plans = [plan];

    Forecast.recalculateNextForecastsBase(APIForecastInstance, '1/2016');

    expect(ForecastAPIInstance.plans[0].details[1].subscribers.existing).to.equal(planDetails.subscribers.existing * 1.01);
  });

  it('should create forecast for each plan in api (only plan details)', () => {
    const plan = ForecastAPIPlan.create({});
    const newPlanDetails = PlanDetails.create({
      ...planDetails,
      date: '2/2016'
    });

    plan.details = [planDetails];

    const serializedPlanDetails = {};

    serializedPlanDetails[plan.id] = newPlanDetails;

    ForecastAPIInstance.plans = [plan];

    Forecast.createForecastForEachPlanInApi(APIForecastInstance, serializedPlanDetails, {});

    expect(plan.details.length).to.equal(2);
  });

  it('should create forecast for each plan in api (plan details and tier details)', () => {
    const plan = ForecastAPIPlan.create({});
    const tier = ForecastTier.create({});
    const newPlanDetails = PlanDetails.create({
      ...planDetails,
      date: '2/2016'
    });

    const newTierDetails = TierDetails.create({
      ...tierDetails,
      date: '2/2016'
    });

    tier.details = [tierDetails];

    plan.details = [planDetails];
    plan.tiers = [tier];

    const serializedPlanDetails = {};
    const serializedTierDetails = {};

    serializedPlanDetails[plan.id] = newPlanDetails;
    serializedTierDetails[plan.id] = {
      [tier.id]: newTierDetails
    };

    ForecastAPIInstance.plans = [plan];

    Forecast.createForecastForEachPlanInApi(APIForecastInstance, serializedPlanDetails, serializedTierDetails);

    expect(plan.details.length).to.equal(2);
    expect(tier.details.length).to.equal(2);
  });
});
