/*eslint no-console:0 */
import {notify} from 'react-notify-toast';

export default function handleFatals(promise) {
  return promise.catch(err => {
    console.error('Fatal error: ', err);
    notify.show(`Critical failure occurred (${err.message || err}). ` +
                'Please refresh the page.', 'error', -1);
    throw err;
  });
}
