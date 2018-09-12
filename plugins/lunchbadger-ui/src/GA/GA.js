class Tracker {
  set = str => this.tracker = str;
  fn = action => `${this.tracker}.${action}`;
}

const {ga} = window;
const tracker = new Tracker();

if (ga) {
  ga(() => tracker.set(window.ga.getAll()[0].a.data.values[':name']));
}

export const GAEvent = (
  eventCategory,
  eventAction,
  eventLabel,
  eventValue,
) => ga && ga(tracker.fn('send'), {
  hitType: 'event',
  eventCategory,
  eventAction,
  eventLabel,
  eventValue
});

export const setGAUserId = userId => ga && ga(tracker.fn('set'), {userId});
