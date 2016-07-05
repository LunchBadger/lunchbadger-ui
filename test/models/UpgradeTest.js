import Upgrade from 'models/Upgrade';
import uuid from 'uuid';

describe('Update Model', () => {
  it('should serialize to JSON', () => {
    const upgrade = Upgrade.create({
      fromPlanId: uuid.v4(),
      toPlanId: uuid.v4(),
      date: '1/2016',
      value: 0,
      downgrade: false
    });

    const serialized = upgrade.toJSON();

    expect(serialized.fromPlanId).to.equal(upgrade.fromPlanId);
    expect(serialized.toPlanId).to.equal(upgrade.toPlanId);
    expect(serialized.date).to.equal(upgrade.date);
    expect(serialized.value).to.equal(upgrade.value);
    expect(serialized.downgrade).to.equal(upgrade.downgrade);
  });
});
