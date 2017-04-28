var path = require('path')

module.exports = function (grunt) {
    var argv = require('optimist').argv

    var mochaOpts = {
        reporter: 'spec',
        require: ['babel-register'],
        grep: argv.grep,
        invert: argv.invert,
        bail: argv.bail,
        timeout: 120000
    }

    function addEnv (envs) {
        grunt.config.merge({ env: { env: { add: envs } } })
    }

    grunt.initConfig({
        pkgFile: 'package.json',
        clean: {
            build: ['build'],
            cordova: ['test/site/platforms'],
            ios: ['test/site/platforms/ios'],
            android: ['test/site/platforms/android']
        },

        mochaTest: {
            desktop: {
                src: ['./test/setup.js', 'test/spec/*.js', 'test/spec/desktop/*.js'],
                options: mochaOpts
            }
        },
    })

    require('load-grunt-tasks')(grunt)
    grunt.registerTask('default', ['build'])
    grunt.registerTask('build', 'Build wdio-mocha', ['eslint', 'clean:build', 'babel', 'copy'])
    grunt.registerTask('buildGuineaPig', [
        'clean:cordova',
        'cordovacli:add_platforms',
        'cordovacli:build_ios',
        'cordovacli:build_android'
    ])
    grunt.registerTask('release', 'Bump and tag version', function (type) {
        grunt.task.run([
            'build',
            'contributors',
            'bump:' + (type || 'patch')
        ])
    })

    grunt.registerTask('test', function (env, cmd) {
        cmd = cmd || 'mochaTest'
        env = env || process.env._ENV || 'desktop'

        /**
         * quick set up for dev
         */
        if (!process.env.CI && env === 'ios') {
            process.env._PLATFORM = 'iOS'
            process.env._VERSION = '9.2'
            process.env._DEVICENAME = 'iPhone 6'
            process.env._APP = path.join(__dirname, '/test/site/platforms/ios/build/emulator/WebdriverIO Guinea Pig.app')
        } else if (!process.env.CI && env === 'android') {
            process.env._PLATFORM = 'Android'
            process.env._VERSION = '4.4'
            process.env._DEVICENAME = 'Samsung Galaxy S4 Emulator'
            process.env._APP = path.join(__dirname, '/test/site/platforms/android/build/outputs/apk/android-debug.apk')
        }
        console.log(cmd, env);

        var tasks = ['connect', cmd + ':' + env]

        addEnv({ _ENV: env })
        process.env._ENV = env

        grunt.task.run(tasks)
    })

    grunt.registerTask('testcover', function (env) {
        env = env || process.env._ENV

        if (typeof env !== 'string') {
            throw new Error('no proper environment specified')
        }

        return grunt.task.run('test:' + env + ':mocha_istanbul')
    })
}
