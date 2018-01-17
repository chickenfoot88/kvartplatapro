const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require("path");
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const glob = require('glob');
const PurifyCSSPlugin = require('purifycss-webpack');

const isProd = process.argv.indexOf('-p') !== -1;

const cssDev = [
	'style-loader',
	'css-loader?sourceMap',
	'sass-loader'
];

const cssProd = ExtractTextPlugin.extract({
	fallback: 'style-loader',
	use: ['css-loader','sass-loader'],
	publicPath: '/dist'
});

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
	entry: {
		app: './src/index.js',
		bootstrap: bootstrapConfig
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: 'js/[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.sass$/,
				use: cssConfig
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'file-loader?name=images/[name].[ext]',
					'image-webpack-loader?bypassOnDebug'
				]
			},
			{
				test: /\.(woff2?)$/,
				use: 'url-loader?limit=10000&name=fonts/[name].[ext]'
			},
			{
				test: /\.(ttf|eot)$/,
				use: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
				use: 'imports-loader?jQuery=jquery'
			},
			{
        test: /\.pug$/,
        exclude: /node_modules/,
        use: ['html-loader', 'pug-html-loader']
      }
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		hot: true,
		open: true,
		stats: 'errors-only'
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.pug'
		}),
		new ExtractTextPlugin({
			filename: 'css/[name].css',
			disable: !isProd,
			allChunks: true
		}),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new PurifyCSSPlugin({
			paths: glob.sync(path.join(__dirname, 'src/*.pug')),
			purifyOptions: {
				minify: true
			}
		})
	]
}
