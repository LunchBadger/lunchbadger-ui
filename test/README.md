## How to start?

The most important file is nightwatch.conf.js present in project root directory.
There you can find and add environment specific tasks.

You need to point to config file when starting the tests, so to run all specs simply type:
`npm test -- -c nightwatch.conf.js`

To run specific spec add to command line:
`npm test -- -c nightwatch.conf.js -t path/to/spec.js`

## Specs
Specs are stored inside `specs` directory. Specs are split into directories by feature.
More about specs format can be found here http://nightwatchjs.org/guide#usage.

## Page objects and commands
Page objects are useful when writing e2e specs, cause they allow to lock some logic
in separate file and make it more reusable. Inside PO user can write some login that
won't be tested, but is required to make test pass, for example login action.

Commands are actions that can be called on web page, but they are not strictly connected
with page object. They are more abstract, can be reusable between projects. 
Example of an action is dragging and dropping objects.

More about page objects and commands:
* http://nightwatchjs.org/guide#page-objects
* http://nightwatchjs.org/guide#extending

### Nightwatch test runner commands
* http://nightwatchjs.org/guide#running-tests
