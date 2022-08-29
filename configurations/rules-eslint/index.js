module.exports = {
    extends: [
		'airbnb-base',
		'prettier',
		'eslint:recommended',
	],
	parserOptions: {
        ecmaVersion: 2020,
    },
    env: {
        node: true,
        mocha: true,
    },
	rules: {
		'default-param-last': 0,
		'import/extensions': 0,
		'import/no-extraneous-dependencies': 0,
		'no-mixed-spaces-and-tabs': 0,
		'no-underscore-dangle': 0,
	},
	overrides: [
        {
            files: ['*.integrationtest.js', '*.test.js', '*.spec.js'],
            rules: {
                'no-unused-expressions': 'off',
            },
        },
    ],
};