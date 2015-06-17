var path = require("path");
var webpack = require("webpack");

module.exports = function(grunt) {

	grunt.loadNpmTasks('grunt-webpack')
	grunt.loadNpmTasks('grunt-nodemon')

	// grunt.loadTasks("tasks");
	
	grunt.initConfig({
		'webpack': {
			photon: {
				entry: "./client/main.js",
				output: {
					path: path.join(__dirname, "public", "javascripts"),
					filename: "bundle.js"
				},
				module: {
					loaders: [
						{ test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
						{ test: /\.jade$/, exclude: /node_modules/, loader: "jade-loader"}
					]
				},
				resolve: {
					root: [path.join(__dirname, "vendor")]
				},
				plugins: [
					new webpack.ResolverPlugin(
						new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
					)
				],
				devtool: [
					'source-map'
				],
				watch: true,
				keepalive: true
			}
		},

		'nodemon': {
			'photon': {
				script: 'index.js',
				options: {
					ignore: ['node_modules/**', 'vendor/**', 'public/javascripts/**', 'client/**']
				}
			}
		}
	});

	grunt.registerTask('bundle', ['webpack']);
	grunt.registerTask('server', ['nodemon']);

}