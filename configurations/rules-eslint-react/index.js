module.exports = {
    extends: [
		'airbnb', 
		'prettier',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:react-hooks/recommended',
	],
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2020,
		requireConfigFile: false,
		ecmaFeatures: {
			jsx: true,
		},
		requireConfigFile: false,
		babelOptions: {
			presets: [require("@babel/preset-react").default]
		}
    },
    plugins: [
		'@babel',
        'formatjs',
	],
    env: {
        es6: true,
        mocha: true,
        browser: true,
    },
    rules: {
        'import/no-unresolved': 'error',
		'react-hooks/rules-of-hooks': 'error',
    	'react-hooks/exhaustive-deps': 'warn',
		'react/no-unstable-nested-components': 'warn',
		'react/jsx-uses-react': 'error',
		'react/display-name': 'warn',
    },
};