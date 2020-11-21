const path = require('path');
const webpack = require('webpack');
const gamedir = path.resolve(__dirname, 'game');
const {execSync} = require('child_process');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
 
let version = require('./package.json').version;
if (process.env.CONTEXT === 'deploy-preview') version += '-' + (process.env.COMMIT_REF || 'unknown').slice(0, 4);
if (process.env.CONTEXT === 'branch-deploy') version += '-dev-' + (process.env.COMMIT_REF || 'unknown').slice(0, 4);

module.exports = (prod = false) => ({
    entry: [
        path.resolve(gamedir, 'ts/index.ts'),
    ],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            $version: JSON.stringify(version),
            $isDevDeployBranch: (process.env.CONTEXT === 'deploy-preview') || (process.env.CONTEXT === 'branch-preview'),
            $production: JSON.stringify(prod),
            $build_date: JSON.stringify(execSync('date +"%F %H:%M:%S"').toString()),
            $password: JSON.stringify(/*prod ? 'username' : */false)
        }),
        new webpack.IgnorePlugin(/polling-xhr\.js/),
        new webpack.IgnorePlugin(/react/),
        // new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.js', '.json']
    },
    output: {
        filename: 'elemental.js',
        path: path.resolve(__dirname, 'dist_client')
    },
    devtool: prod ? "none" : "source-map",
    mode: prod ? "production" : "development"
});
