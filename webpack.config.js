const path = require('path')

module.exports = {
	mode: 'development',

	entry: path.resolve(__dirname, 'src', 'index.js'),

	output: {
		path: path.resolve(__dirname, 'public'),
		filename: 'index.js',
		library: 'app',
		libraryTarget: 'var'
	},

	target: 'web',

	module: {
		rules: [
			{
				test: /\.s[ac]ss$/i,
				use: [
					'style-loader',
					'css-loader',
					'sass-loader'
				]
			}
		]
	},

	resolve: {
		extensions: [ '', '.js', '.css', '.sass' ],
	}

}
