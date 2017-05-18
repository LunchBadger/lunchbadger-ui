import React from 'react';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import reducers from '../../src/reducers';

let store = createStore(
  reducers,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default story => (
  <Provider store={store}>
    {story()}
  </Provider>
);
