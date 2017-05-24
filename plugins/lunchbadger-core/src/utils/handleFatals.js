/*eslint no-console:0 */
import {addSystemDefcon1} from '../../../lunchbadger-ui/src/actions';

export default function handleFatals(promise) {
  return promise.catch(err => {
    const dispatchRedux = LunchBadgerCore.dispatchRedux;
    console.error('Fatal error: ', err);
    dispatchRedux(addSystemDefcon1(err.message || err));
    throw err;
  });
}
