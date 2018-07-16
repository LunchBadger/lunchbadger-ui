## LunchBadger UI

![Build status](https://circleci.com/gh/LunchBadger/lunchbadger-ui.svg?style=shield&circle-token=86cb8d9912528010b54ed16844810098887c48b6)

### Plugins

Plugins are located in the `plugins` directory.

* `lunchbadger-core` - core for whole application - it provides dispatcher and plugin store
* `lunchbadger-compose` - compose plugin providing API for managing data sources and models
* `lunchbadger-manage` - manage plugin which adds options to manipulate gateways and endpoints
* `lunchbadger-monetize` - monetize plugin provides methods to create and manage APIs and plans
* `lunchbadger-monitor` - plugin that adds monitor panel to track API usage
* `lunchbadger-optimize` - plugin that adds panel to forecast future API usage

## Quick start

    # Run dev server
    npm start

    # Run storybook on dev server (library of UI components)
    npm run storybook

    # Build a distribution of storybook into /.out folder
    npm run storybook:build

    # Deploy storybook on GitHub pages: https://lunchbadger.github.io
    npm run storybook:deploy

    # Package a distribution
    npm run dist

    # Run headless tests, setting up the test environment via Docker
    npm run test

    # Run headless tests, but you have to set up your own environment (i.e.
    # configstore, lunchbadger, and dev server need to be running)
    npm run test:nodocker

    # Run tests in dev mode (will start browser on your machine)
    npm run test:dev

Tests run using [nightwatch.js](http://nightwatchjs.org/). Any arguments passed
to the `npm run test` command will be passed through to nightwatch. To specify
a test to run, for example:

    npm run test:dev -t test/specs/datasource/memory.js

### Deploy on staging:

1. each bugfix/feature should be developed in a new branch
2. a new branch should be forked from `master` and named in convention `[bugfix/feature]/[issue-number]-descriptive-task-title`
3. after all needed changes are done and tested locally, commit and push
4. in github create a new PR on this new branch, naming it with prefix `Bugfix/Feature ISSUE_NUBER`
5. PR can be pending on code review, but it should be already published on staging for tests, so:
6. switch to `staging` branch
7. merge your branch into `staging`
8. open `src/index.html` and in 4 bottom lines increase `rnd` parameters
9. open `src/index.js` and increate version in `console.log` line
10. extend subarray below with new item, being PR name
11. commit and push those 2 files with `ver` or `version bump` comment
12. make sure, localhost still works fine
13. in a separate terminal tab, execute `npm run dist:local` - this will build a new dev version
14. when finished, check that staging http://staging.lunchbadger.com/ works fine (so new UI publish will not be a reason when it was already crashed) and execute `aws s3 sync dist/ s3://staging.lunchbadger.com --grants read=uri=http://acs.amazonaws.com/groups/global/AllUsers` - this will upload files into server
15. when finished, check http://staging.lunchbadger.com/ for your recent changes (when in doubts, check browser's console for version number and/or PR id's you put n steps 9-10), and reassign card for review and tests

### Deploy on prod
1. it means, some new card(s) was already tested on staging and PRs has been code reviewed
2. if you're going to publish all recent cards merged to `master`, update it
3. switch to `prod` branch
4. merge a brach(es), which you want to publish (just `master`, or separate bugfix/feature branches), into `prod`
5. open `src/index.html` and in 4 bottom lines increase `rnd` parameters
6. open `src/index.js` and increate version in `console.log` line
7. extend subarray below with new item(s), being id of newly merged PR(s)
8. commit and push those 2 files with `ver` or `version bump` comment
9. make sure, localhost still works fine
10. check that prod http://app.lunchbadger.com/ works fine (so new UI publish will not be a reason when it was already crashed)
11. inform @here on slack #engineering channel, that UI new version will be published on prod
12. in a separate terminal tab, execute `npm run deploy` - this will build a new prod version and upload files into server
13. when finished, do a smoke tests on prod http://app.lunchbadger.com/ that your newly published cards works fine (when in doubts, check browser's console for version number and/or PR id's you put n steps 6-7)
14. inform on slack, that UI new publish has finished

### Important thing while building:

You can set which plugins should be installed during bundling container to main app in `cfg/info.json`
