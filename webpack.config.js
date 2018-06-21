const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
const path = require("path");
const bootstrapEntryPoints = require('./webpack.bootstrap.config');
const globAll = require('glob-all');
const PurifyCSSPlugin = require('purifycss-webpack');



const isProd = process.argv.indexOf('-p') !== -1;

const cssDev = [
	'style-loader',
	'css-loader?sourceMap',
	'sass-loader'
];

const cssProd = ExtractTextPlugin.extract({
	fallback: { loader: 'css-loader', options: { importLoaders: 1 }	},
	use: ['css-loader', 'postcss-loader', 'resolve-url-loader', 'sass-loader'],
	publicPath: '../'
});

const cssConfig = isProd ? cssProd : cssDev;

const bootstrapConfig = isProd ? bootstrapEntryPoints.prod : bootstrapEntryPoints.dev;

module.exports = {
	entry: {
		bootstrap: bootstrapConfig,
		app: './src/index.js'
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: 'js/[name].bundle.js'
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 }	},
					'postcss-loader'
				]
			},
			{
				test: /\.(sass|scss)$/,
				use: cssConfig
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
			  	// { loader: 'postcss-loader', options: { parser: 'sugarss', exec: true } },
					'babel-loader'
				]
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
				test: /\.(ttf|eot|otf)$/,
				use: 'file-loader?name=./fonts/[name].[ext]&publicPath=../'
			},
			{
				test:/bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
				use: 'imports-loader?jQuery=jquery'
			},
			{
        test: /\.pug$/,
        exclude: /node_modules/,
        use: ['html-loader', 'pug-html-loader']
      },
			{
				test: /\.(ico|json|xml)$/,
				loader: 'file-loader?name=[name].[ext]&outputPath=images/&publicPath=images/'
	 		}
		]
	},
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		stats: 'errors-only',
		open: false,
		hot: false
	},
	plugins: [
		new HtmlWebpackPlugin({
			hash: false,
			filename: 'index.html',
			template: './src/index.pug',
			chunksSortMode: packageSort(['bootstrap', 'app']),
			inject: 'body'

		}),
		new ExtractTextPlugin({
			filename: 'css/[name].css',
			disable: !isProd,
			allChunks: true
		}),
		new webpack.ProvidePlugin({
			$: 'jquery',
			jQuery: 'jquery',
			"window.jQuery": "jquery"
		}),
		// new webpack.HotModuleReplacementPlugin(),
		// new webpack.NamedModulesPlugin(),
		new PurifyCSSPlugin({
			paths: globAll.sync([
				path.join(__dirname, 'src/*.pug'),
				path.join(__dirname, 'src/includes/*.pug'),
				path.join(__dirname, 'src/index.js'),
				path.join(__dirname, './node_modules/jquery.mmenu/dist/jquery.mmenu.all.css'),
				path.join(__dirname, './node_modules/bootstrap-validator/dist/validator.min.js'),
				path.join(__dirname, './node_modules/lightbox2/dist/css/lightbox.min.css'),
			]),
			purifyOptions: {
				minify: true
			}
		})
	]
}

function packageSort(packages) {
	return function sort(left, right) {
		var leftIndex = packages.indexOf(left.names[0]);
		var rightindex = packages.indexOf(right.names[0]);

		if ( leftIndex < 0 || rightindex < 0) {
			throw "unknown package";
		}

		if (leftIndex > rightindex){
			return 1;
		}

		return -1;
	}
};
