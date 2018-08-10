import ReactGA from 'react-ga';
import Config from '../../../../src/config';

ReactGA.initialize(Config.get('googleAnalyticsID'), {
  debug: document.location.search === '?ga-debug'
});

export const GAEvent = (
  category,
  action,
  label,
  value,
) => ReactGA.event({
  category,
  action,
  label,
  value
});

export default ReactGA;
