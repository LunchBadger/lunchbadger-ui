'use strict';

require('babel-polyfill');
require('core-js/fn/object/assign');
require('../../lunchbadger-core/dist/core');
require('../../lunchbadger-manage/dist/manage');
require('../../lunchbadger-compose/dist/compose');
require('../../lunchbadger-monetize/dist/monetize');

// Add support for all files in the test directory
const testsContext = require.context('.', true, /(Test\.js$)|(Helper\.js$)/);
testsContext.keys().forEach(testsContext);
