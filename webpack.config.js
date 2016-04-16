/*eslint-env node*/
/*eslint no-var:0*/
var CopyWebpackPlugin = require('copy-webpack-plugin');

var path = require('path'),
    fs = require('fs'),
    webpack = require('webpack'),
    ExtractTextPlugin = require('extract-text-webpack-plugin');

var autoprefixer = require('autoprefixer');

var staticPrefix = './app',
    distPath = './dist';
    console.log("Build: path"+distPath);

// this is set by setup.py sdist
// if (process.env.WEB_STATIC_DIST_PATH) {
//     distPath = process.env.WEB_STATIC_DIST_PATH;
// }

var isProd = false;
if (process.argv.indexOf('-p') > -1 || process.argv.indexOf('--production') > -1) {
    console.log("Build: Production mode");
    isProd = true;
}

var babelQuery = {
    plugins: [],
    extra: {}
};

// var sassLoaders = [
//     'css-loader',
//     'postcss-loader',
//     'sass-loader?indentedSyntax=sass&includePaths[]=' + path.resolve(__dirname, './src')
// ]

var extractTextCSS = new ExtractTextPlugin('stylesheets/[name].css');
var extractTextLESS = new ExtractTextPlugin('stylesheets/[name].less');


var entry = {
    // js
    'app': 'js/main',
    'vendor': [
        'babel-core/polyfill',
        'bootstrap/js/dropdown',
        'bootstrap/js/tab',
        'bootstrap/js/tooltip',
        'bootstrap/js/alert',
        'bootstrap/js/modal',
        'jquery',
        'moment',
        'moment-timezone',
        'lodash'
    ],

    // css
    // NOTE: this will also create an empty 'sentry.js' file
    // TODO: figure out how to not generate this
    'theme': 'less/theme.less'
};


var config = {
    entry: entry,
    context: path.join(__dirname, staticPrefix),
    module: {
        loaders: [
            {
                test: /\.js?$/,
                loader: 'babel-loader',
                include: path.join(__dirname, staticPrefix),
                exclude: /(vendor|node_modules)/,
                query: babelQuery
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.less$/,
                include: path.join(__dirname, staticPrefix),
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
            },
            {
               test: /\.css$/,
               include: path.join(__dirname, staticPrefix),
               loader: extractTextCSS.extract("style-loader", "css-loader")
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg|png|gif|ico|jpg)($|\?)/,
                loader: 'file-loader?name=' + '[name].[ext]'
            }
            // ,
            // {
            //     test: /\.html$/,
            //     loader: 'ng-cache?prefix=[dir]/[dir]'
            // }
        ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            names: ['vendor'] // 'vendor' must be last entry
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery',
            'root.jQuery': 'jquery'
        }),
        new ExtractTextPlugin('[name].css'),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/), // ignore moment.js locale files,
        new CopyWebpackPlugin([
                { from: path.join(__dirname, './app/index.html'), to: path.join(__dirname,'./dist/index.html') },
                { from: path.join(__dirname,'./app/assets'), to: path.join(__dirname,'./dist/assets') },
                { from: path.join(__dirname,'./app/partials'), to: path.join(__dirname,'./dist/partials') }
            ])
    ],
    postcss: [
        autoprefixer({
            browsers: ['last 2 versions']
        })
    ],
    resolve: {
        alias: {
            'flot': path.join(__dirname, staticPrefix, 'vendor', 'jquery-flot'),
            'flot-tooltip': path.join(__dirname, staticPrefix, 'vendor', 'jquery-flot-tooltip'),
        },
        modulesDirectories: [path.join(__dirname, staticPrefix), 'node_modules'],
        extensions: ['', '.jsx', '.js', '.json']
    },
    output: {
        path: distPath,
        filename: '[name].js',
        libraryTarget: 'var',
        library: 'exports',
        sourceMapFilename: '[name].js.map',
    },
    node: {
        fs: "empty"
    }
};

if (isProd) {
    var definePlugin = new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify("production")
    });
} else {
    var definePlugin = new webpack.DefinePlugin({
        'process.env': {
            __DEV__: JSON.stringify(JSON.parse('true'))
        }
    });
}

config.plugins.push(definePlugin)


config.devServer = {
    contentBase:'./dist',
    stats: 'minimal'
  };

module.exports = config;
