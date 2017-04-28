import events from 'events'
import path from 'path'
import fs from 'fs'
import mkdirp from 'mkdirp'
import uuid from 'uuid'

/**
 * Initialize a new `Json` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */
class JsonReporter extends events.EventEmitter {
  static reporterName = 'myreporter'
  constructor (baseReporter, config, options = {}) {
    super()

    this.baseReporter = baseReporter
    this.config = config
    this.options = options

    const { epilogue } = this.baseReporter

    if(options.combined) {
      var resultJsons = [];
    }
    this.on('test:fail', (test, err) => {
      console.log('******************');
    });
    this.on('end', () => {
      for (let cid of Object.keys(this.baseReporter.stats.runners)) {
        const runnerInfo = this.baseReporter.stats.runners[cid]
        const start = this.baseReporter.stats.start
        const end = this.baseReporter.stats.end
        const json = this.prepareJson(start, end, runnerInfo)
        if(options.combined) {
          resultJsons.push(json);
        } else {
          this.write(json, runnerInfo.sanitizedCapabilities, cid)
        }
      }
      if(options.combined) {
        this.combineJsons(resultJsons);
      }
      // epilogue.call(baseReporter)
    })
  }

  prepareJson (start, end, runnerInfo) {
    var resultSet = {}
    var skippedCount = 0
    var passedCount = 0
    var failedCount = 0
    var pendingCount = 0
    var otherCount = 0;
    resultSet.start = start
    resultSet.end = end
    resultSet.capabilities = runnerInfo.capabilities
    resultSet.host = runnerInfo.config.host
    resultSet.port = runnerInfo.config.port
    resultSet.baseUrl = runnerInfo.config.baseUrl
    resultSet.waitForTimeout = runnerInfo.config.waitForTimeout
    resultSet.framework = runnerInfo.config.framework
    resultSet.mochaOpts = runnerInfo.config.mochaOpts
    resultSet.suites = []
    for (let specId of Object.keys(runnerInfo.specs)) {
      const spec = runnerInfo.specs[specId]
      const file = spec.files.join(',');
      for (let suiteName of Object.keys(spec.suites)) {
        const suite = spec.suites[suiteName]
        const testSuite = {}

        testSuite.title = suite.title
        testSuite.duration = suite._duration
        testSuite.start = suite.start
        testSuite.end = suite.end
        testSuite.tests = []
        testSuite.file = file;
        // testSuite.hooks = []

        for (let hookName of Object.keys(suite.hooks)){
          const hook = suite.hooks[hookName]
          const hookResult = {}

          hookResult.start = hook.start
          hookResult.end = hook.end
          hookResult.duration = hook.duration
          hookResult.title = hook.title
          hookResult.associatedSuite = hook.parent
          hookResult.associatedTest = hook.currentTest
          // testSuite.hooks.push(hookResult)
        }

        for (let testName of Object.keys(suite.tests)) {
          const test = suite.tests[testName]
          const testCase = {}


          testCase.title = test.title
          testCase.start = test.start
          testCase.end = test.end
          testCase.duration = test.duration


          if (test.state === 'pending') {
            pendingCount = pendingCount + 1
            testCase.state = test.state;
          } else if (test.state === 'skipped') {
            skippedCount = skippedCount + 1
            testCase.state = test.state
          } else if (test.state === 'pass') {
            passedCount = passedCount + 1
            testCase.state = test.state
          } else if (test.state === 'fail') {
            failedCount = failedCount + 1
            testCase.state = test.state
          } else {
            otherCount += 1;
            testCase.state = test.state
          }

          testCase[test.state] = true;

          if (test.error) {
            // if (test.error.type) {
            //   testCase.errorType = test.error.type
            // }
            // if (test.error.message) {
            //   testCase.error = test.error.message
            // }
            // if (test.error.stack) {
            //   testCase.standardError = test.error.stack
            // }
            testCase.err = test.error;
            testCase.err.name = test.error.type;
          }
          testSuite.tests.push(testCase)
        }
        resultSet.stats = {};
        resultSet.stats.passes = passedCount;
        resultSet.stats.failures = failedCount;
        resultSet.stats.skipped = skippedCount;
        resultSet.stats.pending = pendingCount;
        resultSet.stats.duration = testSuite.duration;

        testSuite.hasTests = !!testSuite.tests.length;
        testSuite.hasPasses = !!passedCount;
        testSuite.hasFailures = !!failedCount;
        testSuite.hasPending = !!pendingCount;
        testSuite.hasSkipped = !!skippedCount;
        testSuite.totalTests = testSuite.tests.length;
        testSuite.totalFailures = failedCount;
        testSuite.totalPasses = passedCount;
        testSuite.totalPending = pendingCount;
        testSuite.totalSkipped = skippedCount;

        if (testSuite.tests && testSuite.tests.length) {
          resultSet.suites.push(testSuite);
        }
      }
    }
    return resultSet
  }

  combineJsons (resultJsons) {
    var resultSet = {}
    var runnerInfo = resultJsons[0]
    resultSet.stats = {}
    resultSet.stats.passes = 0
    resultSet.stats.failures = 0
    resultSet.stats.skipped = 0
    resultSet.stats.duration = 0
    resultSet.stats.pending = 0
    resultSet.stats.start = runnerInfo.start
    resultSet.stats.end = runnerInfo.end
    resultSet.capabilities = runnerInfo.capabilities
    resultSet.host = runnerInfo.host
    resultSet.port = runnerInfo.port
    resultSet.baseUrl = runnerInfo.baseUrl
    resultSet.waitForTimeout = runnerInfo.waitForTimeout
    resultSet.framework = runnerInfo.framework
    resultSet.mochaOpts = runnerInfo.mochaOpts
    resultSet.suites = []
    resultSet.suites = []

    for (const json of resultJsons) {
      resultSet.suites.push.apply(resultSet.suites, json.suites);
      if (json.stats) {
        resultSet.stats.passes += json.stats.passes
        resultSet.stats.skipped += json.stats.skipped
        resultSet.stats.failures += json.stats.failures
        resultSet.stats.duration += json.stats.duration
        resultSet.stats.pending += json.stats.pending
      }
    }

    this.write (resultSet, resultJsons[0].capabilities.browserName)
  }

  write (json, browserName, cid) {
    if (!this.options || typeof this.options.outputDir !== 'string') {
      return console.log(`Cannot write json report: empty or invalid 'outputDir'.`)
    }

    try {
      const dir = path.resolve(this.options.outputDir)
      const filename = this.options.filename ? this.options.filename + (this.options.combined ? '.json' : `-${cid}.json`) : `WDIO.json.${browserName}.${uuid.v1()}.json`
      const filepath = path.join(dir, filename)
      mkdirp.sync(dir)
      fs.writeFileSync(filepath, JSON.stringify(json))
      console.log(`Wrote json report to [${this.options.outputDir}].`)
    } catch (e) {
      console.log(`Failed to write json report to [${this.options.outputDir}]. Error: ${e}`)
    }
  }

  format (val) {
    return JSON.stringify(this.baseReporter.limit(val))
  }
}

export default JsonReporter
