var path = require('path');
var webpack = require('webpack');

// Webpack Plugins
var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
var autoprefixer = require('autoprefixer');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');

/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
var ENV = process.env.npm_lifecycle_event;
var isTest = ENV === 'test' || ENV === 'test-watch';
var isProd = ENV === 'build';

module.exports = function makeWebpackConfig() {
    /**
     * Config
     * Reference: http://webpack.github.io/docs/configuration.html
     * This is the object where all configuration gets set
     */
    var config = {};

    /**
     * Devtool
     * Reference: http://webpack.github.io/docs/configuration.html#devtool
     * Type of sourcemap to use per build type
     */
    if (isTest) {
        config.devtool = 'inline-source-map';
    } else if (isProd) {
        config.devtool = 'source-map';
    } else {
        config.devtool = 'inline-source-map';
    }

    // add debug messages
    config.debug = !isProd || !isTest;

    /**
     * Entry
     * Reference: http://webpack.github.io/docs/configuration.html#entry
     */
    config.entry = isTest ? {} : {
        'app': './src/app/app.module.js'
    };

    /**
     * Output
     * Reference: http://webpack.github.io/docs/configuration.html#output
     */
    config.output = isTest ? {} : {
        path: root('dist'),
        publicPath: isProd ? '/' : 'http://localhost:8080/',
        filename: isProd ? 'js/[name].[hash].js' : 'js/[name].js',
        chunkFilename: isProd ? 'js/[name].[hash].chunk.js' : 'js/[name].chunk.js'
    };

    /**
     * Resolve
     * Reference: http://webpack.github.io/docs/configuration.html#resolve
     */
    config.resolve = {
        alias: {
            'afValidation': path.join(__dirname, 'src/scripts/forms.js')
        },
        cache: !isTest,
        root: root(),
        // only discover files that have those extensions
        extensions: ['', '.js', '.json', '.css', '.scss', '.html', '.png']
    };

    /**
     * Loaders
     * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
     * List: http://webpack.github.io/docs/list-of-loaders.html
     * This handles most of the magic responsible for converting modules
     */
    config.module = {
        preLoaders: isTest ? [] : [{ test: /\.js$/, loader: 'eslint' }],
        loaders: [
            { 
                test: /\.js$/, 
                loader: 'babel', 
                include: [
                    root('src', 'app')
                ]
            },
            // copy those assets to output
            { 
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                include: [
                    root('src', 'fonts'),
                    root('src', 'images'),
                    rootNode('bootstrap-sass')
                ], 
                loader: 'file?name=fonts/[name].[hash].[ext]?' 
            },
            // Support for *.json files.
            { test: /\.json$/, loader: 'json' },

            { 
                test: /\.css$/, 
                include: [
                    root('src', 'app'),
                    root('src', 'style'),
                    rootNode('angular-ui-bootstrap')
                ], 
                loader: isTest ? 'null' : ExtractTextPlugin.extract('css?sourceMap!postcss')
            },

            {
                test: /\.scss$/,
                include: [
                    root('src', 'style'),
                    root('src', 'app'),
                    rootNode('bootstrap-sass')
                ],
                loader: isTest ? 'null' : ExtractTextPlugin.extract('css?sourceMap!postcss!sass')
            },

            // support for .html as raw text
            // { test: /\.html$/, include: root('src', 'app'), loader: 'ngtemplate?relativeTo=' + root('src', 'app') + '/!html' },
            { test: /\.html$/, include: root('src', 'app'), loader: 'raw' },

        ],
        postLoaders: [],
        noParse: []
    };

    if (isTest) {
        // instrument only testing sources with Istanbul, covers js compiled files for now :-/
        config.module.postLoaders.push({
            test: /\.js$/,
            include: path.resolve('src'),
            loader: 'istanbul-instrumenter-loader',
            exclude: [/\.spec\.js$/, /\.e2e\.js$/, /node_modules/]
        })
    }

    /**
     * Plugins
     * Reference: http://webpack.github.io/docs/configuration.html#plugins
     * List: http://webpack.github.io/docs/list-of-plugins.html
     */
    config.plugins = [
        // Define env variables to help with builds
        // Reference: https://webpack.github.io/docs/list-of-plugins.html#defineplugin
        new webpack.DefinePlugin({
            // Environment helpers
            'process.env': {
                ENV: JSON.stringify(ENV)
            }
        }),
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        })
    ];

    if (!isTest) {
        config.plugins.push(
            // Generate common chunks if necessary
            // Reference: https://webpack.github.io/docs/code-splitting.html
            // Reference: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
            // new CommonsChunkPlugin({
            //     name: ['core']
            // }),

            // Inject script and link tags into html files
            // Reference: https://github.com/ampedandwired/html-webpack-plugin
            new HtmlWebpackPlugin({
                template: './src/public/index.html',
                inject: 'body',
                chunksSortMode: packageSort(['app'])
            }),

            // Extract css files
            // Reference: https://github.com/webpack/extract-text-webpack-plugin
            // Disabled when in test mode or not in build mode
            new ExtractTextPlugin('css/[name].[hash].css', {  }),
            // // Copy assets from the public folder
            // // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([
                {
                    from: root('src/public')
                }
            ])
        );
    }

    // // Add build specific plugins
    if (isProd) {
        config.plugins.push(
            // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
            // Only emit files when there are no errors
            new webpack.NoErrorsPlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
            // Dedupe modules in the output
            new webpack.optimize.DedupePlugin(),

            // Reference: http://webpack.github.io/docs/list-of-plugins.html#uglifyjsplugin
            // Minify all javascript, switch loaders to minimizing mode
            new webpack.optimize.UglifyJsPlugin({
                // Angular 2 is broken again, disabling mangle until beta 6 that should fix the thing
                // Todo: remove this with beta 6
                mangle: false
            }),
            // // Copy assets from the public folder
            // // Reference: https://github.com/kevlened/copy-webpack-plugin
            new CopyWebpackPlugin([
                {
                    from: root('CNAME')
                }
            ])
        );
    }

    /**
     * PostCSS
     * Reference: https://github.com/postcss/autoprefixer-core
     * Add vendor prefixes to your css
     */
    config.postcss = [
        autoprefixer({
            browsers: ['last 2 version']
        })
    ];

    /**
     * Sass
     * Reference: https://github.com/jtangelder/sass-loader
     * Transforms .scss files to .css
     */
    config.sassLoader = {
        
    };

    config.eslint = {
        emitErrors: false,
        failOnHint: false,
        failOnWarning: false,
        failOnError: true
    };

    /**
     * Dev server configuration
     * Reference: http://webpack.github.io/docs/configuration.html#devserver
     * Reference: http://webpack.github.io/docs/webpack-dev-server.html
     */
    config.devServer = {
        contentBase: './src/public',
        historyApiFallback: true,
        stats: 'minimal' // none (or false), errors-only, minimal, normal (or true) and verbose
    };

    config.node = {
        fs: "empty"
    };

    return config;
} ();

// Helper functions
function root(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return path.join.apply(path, [__dirname].concat(args));
}

function rootNode(args) {
    args = Array.prototype.slice.call(arguments, 0);
    return root.apply(path, ['node_modules'].concat(args));
}

function packageSort(packages) {
    var len = packages.length - 1;
    var first = packages[0];
    var last = packages[len];
    return function sort(a, b) {
        if (a.names[0] === first) {
            return -1;
        }
        if (a.names[0] === last) {
            return 1;
        }
        if (a.names[0] !== first && b.names[0] === last) {
            return -1;
        } else {
            return 1;
        }
    }
}
