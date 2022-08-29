const path = require('path');

const root = path.resolve(__dirname, '..');
const devRoot = path.resolve(__dirname, '.');
const dist = path.resolve(root, './dist');

module.exports = {
	root,
	devRoot,
	webAppSrc: path.resolve(root, 'dist'),
	outputPath: path.resolve(root, 'build'),
	entryPath: path.resolve(dist, 'index.js'),
	templatePath: path.resolve(devRoot, 'template.html'),
	imagesFolder: 'images',
	fontsFolder: 'fonts',
	cssFolder: 'css',
	jsFolder: 'js',
};
