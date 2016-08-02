var path = require('path');
var webpackConfig = require('./webpack.config');
var preprocessors = {}; 
preprocessors['./src/app/app.module.js'] = ['webpack'];
preprocessors['spec.bundle.js'] = ['webpack'];
//preprocessors['**/*.html'] = ['ng-html2js'];

module.exports = function (config) {
    config.set({
        // base path used to resolve all patterns
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha', 'chai', 'sinon'],

        // list of files/patterns to load in the browser
        //files: ['./src/app/app.module.js'],
        files: [
            './src/app/app.module.js',
            {pattern: 'spec.bundle.js', watched: false}
        ],

        // files to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: preprocessors,

        webpack: webpackConfig,

        // webpackServer: {
        //     noInfo: true // prevent console spamming when running in Karma!
        // },

        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['mocha', 'coverage'],

        // web server port
        port: 9876,

        // enable colors in the output
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // toggle whether to watch files and rerun tests upon incurring changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        // if true, Karma runs tests once and exits
        singleRun: true,

        coverageReporter: {
            type: 'html',
            dir: 'coverage'
        },
     
        client: {
            captureConsole: true,
            mocha: {
                bail: false
            }
        }
    });
};